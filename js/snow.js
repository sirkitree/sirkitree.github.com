class SnowEffect {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'snow-container';
    document.body.appendChild(this.container);
    
    this.snowflakes = [];
    this.maxSnowflakes = 50;
    this.textElements = [];
    
    this.updateTextElements();
    this.createInitialSnowflakes();
    this.startSnowfall();
    
    // Update text elements periodically
    setInterval(() => this.updateTextElements(), 2000);
  }

  updateTextElements() {
    this.textElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li'))
      .filter(el => el.offsetParent !== null && !el.closest('.snow-container'));
  }

  createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    
    // Random starting position
    const startX = Math.random() * 100;
    snowflake.style.left = `${startX}%`;
    
    // Random size variation
    const size = Math.random() * 4 + 4;
    snowflake.style.width = `${size}px`;
    snowflake.style.height = `${size}px`;
    
    // Random animation duration
    const duration = Math.random() * 5 + 10;
    snowflake.style.animation = `fall ${duration}s linear forwards`;
    
    this.container.appendChild(snowflake);
    
    // Track snowflake position and check for collisions
    let lastY = -100; // Track vertical movement
    let stuckCount = 0; // Track how many frames the snowflake hasn't moved

    const checkCollision = () => {
      const rect = snowflake.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Check if snowflake is stuck (hasn't moved vertically)
      if (Math.abs(y - lastY) < 0.1) {
        stuckCount++;
        if (stuckCount > 5) { // If stuck for more than 5 frames, remove it
          snowflake.remove();
          return;
        }
      } else {
        stuckCount = 0;
        lastY = y;
      }

      // Check collision with text elements
      for (const element of this.textElements) {
        const elementRect = element.getBoundingClientRect();
        
        if (x >= elementRect.left && 
            x <= elementRect.right && 
            y >= elementRect.top - 2 && 
            y <= elementRect.bottom) {
          
          // Stop animation exactly where it landed
          snowflake.style.animation = 'none';
          snowflake.classList.add('accumulated');
          
          // Keep the exact position where it landed
          const top = y - (rect.height / 2);
          const left = x - (rect.width / 2);
          
          snowflake.style.transform = 'none';
          snowflake.style.top = `${top}px`;
          snowflake.style.left = `${left}px`;
          snowflake.style.opacity = '0.8';
          
          // Remove after some time
          setTimeout(() => {
            snowflake.style.opacity = '0';
            setTimeout(() => snowflake.remove(), 500);
          }, 10000 + Math.random() * 5000);
          
          return;
        }
      }

      // Continue checking if not accumulated
      if (y < window.innerHeight + 100) {
        requestAnimationFrame(checkCollision);
      } else {
        snowflake.remove();
      }
    };

    requestAnimationFrame(checkCollision);
    this.snowflakes.push(snowflake);
  }

  createInitialSnowflakes() {
    for (let i = 0; i < this.maxSnowflakes / 2; i++) {
      setTimeout(() => {
        this.createSnowflake();
      }, Math.random() * 5000);
    }
  }

  startSnowfall() {
    setInterval(() => {
      if (document.querySelectorAll('.snowflake').length < this.maxSnowflakes) {
        this.createSnowflake();
      }
    }, 500);
  }
}

// Initialize snow effect when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SnowEffect();
});
