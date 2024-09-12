function alert_(message) {
    return new Promise(function(resolve) {
      // Create modal HTML structure
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center;
      `;
  
      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background-color: white; color: black; padding: 20px; text-align: center; border-radius: 8px;
      `;
  
      const messageElem = document.createElement('p');
      messageElem.textContent = message;
  
      const okButton = document.createElement('button');
      okButton.textContent = 'OK';
      okButton.style.cssText = 'padding: 10px; margin-top: 10px;';
  
      // Append content to modal
      modalContent.appendChild(messageElem);
      modalContent.appendChild(okButton);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
  
      // Handle OK button click
      okButton.onclick = function() {
        document.body.removeChild(modal); // Remove modal from DOM
        resolve();
      };
    });
  }
  
  function confirm_(message) {
    return new Promise(function(resolve) {
      // Create modal HTML structure
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center;
      `;
  
      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background-color: white; color: black; padding: 20px; text-align: center; border-radius: 8px;
      `;
  
      const messageElem = document.createElement('p');
      messageElem.textContent = message;
  
      const yesButton = document.createElement('button');
      yesButton.textContent = 'Yes';
      yesButton.style.cssText = 'padding: 10px; margin: 10px;';
  
      const noButton = document.createElement('button');
      noButton.textContent = 'No';
      noButton.style.cssText = 'padding: 10px; margin: 10px;';
  
      // Append content to modal
      modalContent.appendChild(messageElem);
      modalContent.appendChild(yesButton);
      modalContent.appendChild(noButton);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
  
      // Handle Yes/No button clicks
      yesButton.onclick = function() {
        document.body.removeChild(modal); // Remove modal from DOM
        resolve(true);
      };
  
      noButton.onclick = function() {
        document.body.removeChild(modal); // Remove modal from DOM
        resolve(false);
      };
    });
  }
  
  function prompt_(message, defaultValue = '') {
    return new Promise(function(resolve) {
      // Create modal HTML structure
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center;
      `;
  
      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background-color: white; color: black; padding: 20px; text-align: center; border-radius: 8px;
      `;
  
      const messageElem = document.createElement('p');
      messageElem.textContent = message;
  
      const inputElem = document.createElement('input');
      inputElem.type = 'text';
      inputElem.value = defaultValue;
      inputElem.style.cssText = 'padding: 8px; width: 100%; margin: 10px 0;';
  
      const okButton = document.createElement('button');
      okButton.textContent = 'OK';
      okButton.style.cssText = 'padding: 10px; margin-right: 10px;';
  
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Cancel';
      cancelButton.style.cssText = 'padding: 10px;';
  
      // Append content to modal
      modalContent.appendChild(messageElem);
      modalContent.appendChild(inputElem);
      modalContent.appendChild(okButton);
      modalContent.appendChild(cancelButton);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
  
      // Handle OK/Cancel button clicks
      okButton.onclick = function() {
        document.body.removeChild(modal); // Remove modal from DOM
        resolve(inputElem.value);
      };
  
      cancelButton.onclick = function() {
        document.body.removeChild(modal); // Remove modal from DOM
        resolve(null);
      };
    });
  }
  

  function safeAlert(message) {
    try {
      // Try to use the native alert function
      alert(message);
    } catch (e) {
      // If alert is blocked (e.g., due to sandbox), fall back to custom alert
      alert_(message);
    }
  }
  