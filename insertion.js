  document.addEventListener('DOMContentLoaded', function() {
            const barsContainer = document.getElementById('barsContainer');
            const startBtn = document.getElementById('startBtn');
            const resetBtn = document.getElementById('resetBtn');
            const speedControl = document.getElementById('speed');
            const numberInput = document.getElementById('numberInput');
            const submitBtn = document.getElementById('submitBtn');
            const randomBtn = document.getElementById('randomBtn');
            const useDefaultBtn = document.getElementById('useDefaultBtn');
            const errorMessage = document.getElementById('errorMessage');
            
            let bars = [];
            let values = [];
            const defaultValues = [45, 27, 0, 0, 10, 20, 30, 40, 50, 60, 70];
            
            // Initialize with default values
            useDefaultValues();
            
            // Event listeners for input buttons
            submitBtn.addEventListener('click', processUserInput);
            randomBtn.addEventListener('click', generateRandomValues);
            useDefaultBtn.addEventListener('click', useDefaultValues);
            
            // Also process input when user presses Enter
            numberInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    processUserInput();
                }
            });
            
            // Initialize the visualization
            function init() {
                barsContainer.innerHTML = '';
                bars = [];
                
                if (values.length === 0) return;
                
                const maxValue = Math.max(...values);
                const minBarWidth = Math.max(20, Math.floor(1000 / values.length) - 10);
                
                values.forEach((value, index) => {
                    const bar = document.createElement('div');
                    bar.className = 'bar';
                    bar.style.width = `${minBarWidth}px`;
                    
                    // Calculate height based on the value (as percentage of max value)
                    const heightPercentage = (value / maxValue) * 100;
                    bar.style.height = `${heightPercentage}%`;
                    
                    const label = document.createElement('div');
                    label.className = 'bar-label';
                    label.textContent = value;
                    
                    bar.appendChild(label);
                    barsContainer.appendChild(bar);
                    
                    bars.push(bar);
                });
                
                // Enable/disable buttons based on input
                startBtn.disabled = values.length === 0;
                resetBtn.disabled = values.length === 0;
            }
            
            // Process user input
            function processUserInput() {
                errorMessage.textContent = '';
                const input = numberInput.value.trim();
                
                if (!input) {
                    errorMessage.textContent = 'Please enter some numbers';
                    return;
                }
                
                try {
                    // Parse input string into array of numbers
                    values = input.split(',')
                        .map(item => item.trim())
                        .filter(item => item !== '')
                        .map(item => {
                            const num = Number(item);
                            if (isNaN(num)) {
                                throw new Error(`"${item}" is not a valid number`);
                            }
                            return num;
                        });
                    
                    if (values.length === 0) {
                        throw new Error('No valid numbers entered');
                    }
                    
                    init();
                } catch (error) {
                    errorMessage.textContent = error.message;
                    values = [];
                    init();
                }
            }
            
            // Generate random values
            function generateRandomValues() {
                errorMessage.textContent = '';
                const count = Math.floor(Math.random() * 10) + 5; // 5-14 elements
                values = Array.from({length: count}, () => Math.floor(Math.random() * 100));
                numberInput.value = values.join(', ');
                init();
            }
            
            // Use default values
            function useDefaultValues() {
                errorMessage.textContent = '';
                values = [...defaultValues];
                numberInput.value = values.join(', ');
                init();
            }
            
            // Insertion sort algorithm visualization
            async function insertionSort() {
                startBtn.disabled = true;
                resetBtn.disabled = true;
                submitBtn.disabled = true;
                randomBtn.disabled = true;
                useDefaultBtn.disabled = true;
                
                const n = values.length;
                const speed = 1100 - (speedControl.value * 100); // Convert to delay in ms
                
                // Mark first element as sorted
                bars[0].classList.add('sorted');
                
                for (let i = 1; i < n; i++) {
                    // Highlight current key
                    bars[i].classList.add('current-key');
                    await new Promise(resolve => setTimeout(resolve, speed));
                    
                    let j = i - 1;
                    const currentValue = values[i];
                    
                    while (j >= 0 && values[j] > currentValue) {
                        // Highlight comparison
                        bars[j].classList.add('comparing');
                        await new Promise(resolve => setTimeout(resolve, speed/2));
                        
                        // Shift element to the right
                        values[j + 1] = values[j];
                        
                        // Update bar height and label
                        const maxValue = Math.max(...values);
                        bars[j + 1].style.height = `${(values[j + 1] / maxValue) * 100}%`;
                        bars[j + 1].querySelector('.bar-label').textContent = values[j + 1];
                        
                        // Remove highlight
                        bars[j].classList.remove('comparing');
                        
                        // Mark as unsorted temporarily
                        bars[j + 1].classList.remove('sorted');
                        
                        j--;
                    }
                    
                    // Insert the key in correct position
                    values[j + 1] = currentValue;
                    
                    // Update bar height and label
                    const maxValue = Math.max(...values);
                    bars[j + 1].style.height = `${(values[j + 1] / maxValue) * 100}%`;
                    bars[j + 1].querySelector('.bar-label').textContent = values[j + 1];
                    
                    // Remove key highlight and mark as sorted
                    bars[i].classList.remove('current-key');
                    for (let k = 0; k <= i; k++) {
                        bars[k].classList.add('sorted');
                    }
                    
                    await new Promise(resolve => setTimeout(resolve, speed));
                }
                
                // Mark all bars as sorted at the end
                bars.forEach(bar => {
                    bar.classList.add('sorted');
                });
                
                startBtn.disabled = true;
                resetBtn.disabled = false;
                submitBtn.disabled = false;
                randomBtn.disabled = false;
                useDefaultBtn.disabled = false;
            }
            
            // Event listeners for sorting controls
            startBtn.addEventListener('click', insertionSort);
            resetBtn.addEventListener('click', init);
            
            // Initialize on load
            init();
        });
    