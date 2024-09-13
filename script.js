    console.log("connected");
    
    // script.js
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('aiCanvas');
        const ctx = canvas.getContext('2d');
        const promptInput = document.getElementById('promptInput');
        const submitButton = document.getElementById('submitButton');
        const menuButton = document.getElementById('menuButton');
        const menuPopup = document.getElementById('menuPopup');
        const closeMenu = document.getElementById('closeMenu');
        const overlay = document.getElementById('overlay');
        const spinner = document.querySelector('.spinner');
        const errorPopup = document.querySelector('.error-popup');
        const PAINTER_URL = 'https://roynek.com/AI-Viddor/API/generate-paint'
      
        // Set canvas dimensions
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
      
        // Function to show the spinner
        function showSpinner() {
          overlay.style.display = 'block';
          spinner.style.display = 'block';
        }
      
        // Function to hide the spinner
        function hideSpinner() {
          overlay.style.display = 'none';
          spinner.style.display = 'none';
        }
      
        // Function to show the error popup
        function showErrorPopup(message) {
          errorPopup.textContent = message;
          errorPopup.style.display = 'block';
        }
      
        // Clear canvas function
        function clearCanvas() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      
      
        function getShapesFromElements(elements) {
            // Define possible paths where the shapes array might be located
            const possiblePaths = [
                elements.shapes,
                elements,
                elements.canvas_elements?.shapes,
                elements.canvas_elements
            ];
      
            // Find and return the first valid shapes array
            for (const path of possiblePaths) {
                if (Array.isArray(path)) {
                    return path;
                }
            }
      
            // If no valid shapes array is found, return an empty array or handle the error
            console.error("No valid shapes array found in the provided elements.");
            return [];
        }
      
      
        // Assuming extractCanvasElements is your function to parse the JSON from the AI response
        function extractCanvasElements(aiResponse) {
            // Find the first opening bracket '{' or '['
            const startIndex = aiResponse.search(/[\{\[]/);
      
            // If no opening bracket is found, return null
            if (startIndex === -1) {
                console.error("No JSON structure found in the response.");
                return null;
            }
      
            // Find the last closing bracket '}' or ']'
            const endIndex = aiResponse.lastIndexOf('}') > aiResponse.lastIndexOf(']') 
                ? aiResponse.lastIndexOf('}') 
                : aiResponse.lastIndexOf(']');
      
            // If no closing bracket is found, return null
            if (endIndex === -1) {
                console.error("No JSON structure found in the response.");
                return null;
            }
      
            // Extract the JSON-like substring
            const jsonString = aiResponse.substring(startIndex, endIndex + 1).replace(/'/g, '"');
      
            // Try to parse it as JSON
            try {
                const canvasElements = JSON.parse(jsonString);
                console.log(canvasElements.canvas_elements);
                return canvasElements.canvas_elements;
            } catch (e) {
                console.error("Error decoding JSON:", e);
                return null;
            }
        }
      
      
      // Function to create a delay
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Function to draw on the canvas using shapes with a delay for each shape
        async function drawCanvasElements(elements, ctx, delayTime = 500, inner_timers=500) {
            // Use getShapesFromElements to safely retrieve the shapes array
            const shapes = getShapesFromElements(elements);

            if (shapes.length === 0) {
                console.error("No shapes to draw.");
                return;
            }

            for (const element of shapes) {
                console.log("drawing: " + JSON.stringify(element));

                switch (element.type) {
                    case 'ellipse':
                        ctx.beginPath();
                        ctx.ellipse(element.cx, element.cy, element.rx, element.ry, 0, 0, 2 * Math.PI);
                        await delay(inner_timers);
                        ctx.fillStyle = element.color;
                        ctx.fill();
                        break;

                    case 'rectangle':
                        ctx.beginPath();
                        ctx.rect(element.x, element.y, element.width, element.height);
                        await delay(inner_timers);
                        ctx.fillStyle = element.color;
                        ctx.fill();
                        ctx.lineWidth = element.borderWidth;
                        ctx.strokeStyle = element.borderColor;
                        ctx.stroke();
                        break;

                    case 'line':
                        ctx.beginPath();
                        ctx.moveTo(element.x1, element.y1);
                        ctx.lineTo(element.x2, element.y2);
                        await delay(inner_timers);
                        ctx.strokeStyle = element.color;
                        ctx.lineWidth = element.lineWidth;
                        ctx.stroke();
                        break;

                    case 'text':
                        ctx.font = element.font;
                        await delay(inner_timers);
                        ctx.fillStyle = element.color;
                        ctx.fillText(element.text, element.x, element.y);
                        break;

                    case 'dot':
                        ctx.beginPath();
                        ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
                        ctx.fillStyle = element.color;
                        ctx.fill();
                        break;

                    case 'multi-dot':
                        element.positions.forEach(position => {
                            ctx.beginPath();
                            ctx.arc(position.x, position.y, element.radius, 0, 2 * Math.PI);
                            ctx.fillStyle = element.color;
                            ctx.fill();
                        });
                        break;

                    case 'arc':
                        ctx.beginPath();
                        ctx.arc(element.cx, element.cy, element.radius, element.startAngle, element.endAngle);
                        await delay(inner_timers);
                        ctx.strokeStyle = element.color;
                        ctx.lineWidth = element.lineWidth;
                        ctx.stroke();
                        break;

                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(element.cx, element.cy, element.radius, 0, 2 * Math.PI);
                        await delay(inner_timers);
                        ctx.fillStyle = element.color;
                        ctx.fill();
                        ctx.lineWidth = element.borderWidth;
                        ctx.strokeStyle = element.borderColor;
                        ctx.stroke();
                        break;

                    default:
                        console.log(`Unknown shape type: ${element.type}`);
                }

                // Delay before drawing the next shape
                await delay(delayTime);
            }
        }

      
        
        // Submit button event listener
submitButton.addEventListener('click', async () => {
    if (await confirm_('You may lose this nice drawing. Do you want to continue?')) {
  
      // Clear the canvas
      clearCanvas();
      
      const prompt = promptInput.value;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
  
      // Send prompt and canvas dimensions to the AI API
      const requestData = {
        prompt,
        canvasWidth,
        canvasHeight
      };
  
      // Show spinner
      showSpinner();
  
      // Mock API request (replace with actual API call)
      fetch(PAINTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      .then(response => response.json())
      .then(async data => {  // Mark the function as async to use await
        console.log(data);
  
        hideSpinner();
        // Use the standardized JSON to draw on the canvas
        const drawables = extractCanvasElements(data.text);
        
        // Await the drawing process with delay
        await drawCanvasElements(drawables, ctx, 1000); // 1000ms delay between each shape
      })
      .catch(error => {
        hideSpinner();
        showErrorPopup('Error: ' + error.message);
        console.error('Error:', error);
      });
    }
  });
  
        // Submit button event listener
        // submitButton.addEventListener('click', () => {
        //   if (confirm('You may lose this nice drawing. Do you want to continue?')) {
      
        //     // Clear the canvas
        //     clearCanvas();
            
        //     const prompt = promptInput.value;
        //     const canvasWidth = canvas.width;
        //     const canvasHeight = canvas.height;
      
        //     // Send prompt and canvas dimensions to the AI API
        //     const requestData = {
        //       prompt,
        //       canvasWidth,
        //       canvasHeight
        //     };
      
        //     // Show spinner
        //     showSpinner();
      
        //     // Mock API request (replace with actual API call)
        //     fetch(PAINTER_URL, {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json',
        //       },
        //       body: JSON.stringify(requestData),
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //       console.log(data);
      
        //       hideSpinner();
        //       // Use the standardized JSON to draw on the canvas
        //       var drawables = extractCanvasElements(data.text);
        //       drawCanvasElements(drawables, ctx);
              
        //       // drawCanvasElements(data.canvasElements);
        //     })
        //     .catch(error => {
        //       hideSpinner();
        //       showErrorPopup('Error: ' + error.message);
        //       console.error('Error:', error);
        //     });
        //   }
        // });
      
        // Menu button event listener
        menuButton.addEventListener('click', () => {
          menuPopup.classList.toggle('active');
        });
      
        // Close menu button event listener
        closeMenu.addEventListener('click', () => {
          menuPopup.classList.remove('active');
        });
      
      

        // Example Usage
      const data = {
            text: "{\n  \"canvas_elements\": {\n    \"shapes\": [\n      {\n        \"type\": \"rectangle\",\n        \"x\": 400,\n        \"y\": 350,\n        \"width\": 50,\n        \"height\": 200,\n        \"color\": \"#8B4513\",\n        \"borderColor\": \"black\",\n        \"borderWidth\": 2\n      },\n      {\n        \"type\": \"ellipse\",\n        \"cx\": 425,\n        \"cy\": 200,\n        \"rx\": 100,\n        \"ry\": 150,\n        \"color\": \"#008000\"\n      },\n      {\n        \"type\": \"ellipse\",\n        \"cx\": 350,\n        \"cy\": 300,\n        \"rx\": 70,\n        \"ry\": 100,\n        \"color\": \"#008000\"\n      },\n      {\n        \"type\": \"ellipse\",\n        \"cx\": 500,\n        \"cy\": 300,\n        \"rx\": 70,\n        \"ry\": 100,\n        \"color\": \"#008000\"\n      }\n    ]\n  }\n}"
        };
        
        const dataFrame = extractCanvasElements(data.text);
        // drawCanvasElements(dataFrame, ctx);

        // Function to start drawing with a delay
        async function startDrawing() {
            await drawCanvasElements(dataFrame, ctx, 1000); // 1000ms delay between each shape
        }

        // Call the startDrawing function to begin
        startDrawing();
        
    });
      
