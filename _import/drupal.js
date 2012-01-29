// Install node.js and npm:
//    http://joyeur.com/2010/12/10/installing-node-and-npm/
// Then run
//    npm install mysql date-utils
//    node drupal.js
// NOTE: you will want to customize any queries in here for your particular
//    Drupal installation.
var mysql = require('mysql')
  , client = client2 = mysql.createClient({
    user: 'root',
    password: 'root',
    database: 'jeradbitner'
  })
  , path = require('path')
  , fs = require('fs')
  , require('date-utils'); //d.toYMD(separator)

// Directory creation.
path.exists('../_posts', function(exists) {
  if (!exists) {
    fs.mkdirSync("../_posts");
  }
});
path.exists('../_drafts', function(exists) {
  if (!exists) {
    fs.mkdirSync("../_drafts");
  }
});

// Get required fields and construct Jekyll compatible name.
// ---
// Book Query: (not perfect, my install has no aliases and I needed to remove the permalinks)
// "SELECT n.nid, n.title, n.created, n.status, b.body_value FROM node n, field_data_body b " +
// "WHERE n.type IN('book') AND b.entity_type = 'node' AND b.bundle IN('book') AND b.entity_id = n.nid;",
client.query(
  "SELECT n.nid, n.title, n.created, n.status, b.body_value, a.alias FROM node n, field_data_body b, url_alias a " +
  "WHERE n.type IN('blog', 'story') AND b.entity_type = 'node' AND b.bundle IN('blog', 'story') AND b.entity_id = n.nid AND a.source = CONCAT('node/', n.nid);",
  function selectNodes(err, results, fields) {
    if (err) throw err;

    // console.log(results);
    for (var i = results.length -1; i >= 0; i--) {
      var nid = results[i].nid;
      var title = results[i].title;
      var content = results[i].body_value;
      var created = results[i].created;
      var timestamp = new Date(created*1000);
      if (results[i].alias) {
        var permalink = '/' + results[i].alias;
      }

      // Determine what directory to place this post in.
      var is_published = results[i].status == 1;
      var dir = is_published ? "../_posts" : "../_drafts";

      // Create the filename.
      var slug = title.toString().replace(/(&|&amp;)/g, ' and ').replace(/[\s\.\/\\]/g, '-').replace(/[^\w-]/g, '').replace(/[-_]{2,}/g, '-').replace(/^[-_]/g, '').replace(/[-_]$/g, '').toLowerCase();
      var name = timestamp.toYMD('-') + '-' + slug + '.md';
      var filename = dir + '/' + name;

      // Start data.
      var data = "---\nlayout : post\ntitle : \"" + title + "\"\ncreated : " + created + "\n";
      if (permalink) {
        data += "permalink : " + permalink + "\n";
      }

      queryTags(nid, filename, data, content);
    }
  }
);

// See if we have any tags. You will want to customize this query.
function queryTags(nid, filename, data, content) {
  // Grab tags as categories.
  var tags = new Array();
  client.query(
    "SELECT td.name FROM field_data_taxonomy_vocabulary_2 f INNER JOIN taxonomy_term_data td ON (f.taxonomy_vocabulary_2_tid = td.tid) WHERE f.entity_id = ?",
    [nid],
    function selectTags(err, results, fields) {
      if (err) throw err;

      for (var i = results.length -1; i > 0; i--) {
        if (results[i].name) {
          tags.push(results[i].name);
        }
      }

      if (tags) {
        data += "categories : " + JSON.stringify(tags) + "\n";
      }

      writeContent(filename, data, content);
  });
}

// Add the ending YAML dashes and content, then write to file.
function writeContent(filename, data, content) {
  // End YAML.
  data += "---\n" + content;

  // Write file.
  writeYaml(filename, data);
}

// Write your YAML files to disk.
function writeYaml(filename, data) {
  // Write out the data and content to file
  fs.writeFile(filename, data, 'utf8', function(err, written) {
    if (err) return console.log(err);

  });

  // End our mysql client.
  client.end();
}