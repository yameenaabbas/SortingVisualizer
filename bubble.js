
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
                let isSorting = false;
                
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
                    if (isSorting) return;
                    
                    barsContainer.innerHTML = '';
                    bars = [];
                    
                    if (values.length === 0) {
                        startBtn.disabled = true;
                        resetBtn.disabled = true;
                        return;
                    }
                    
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
                    if (isSorting) return;
                    
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
                    if (isSorting) return;
                    
                    errorMessage.textContent = '';
                    const count = Math.floor(Math.random() * 10) + 5; // 5-14 elements
                    values = Array.from({length: count}, () => Math.floor(Math.random() * 100));
                    numberInput.value = values.join(', ');
                    init();
                }
                
                // Use default values
                function useDefaultValues() {
                    if (isSorting) return;
                    
                    errorMessage.textContent = '';
                    values = [...defaultValues];
                    numberInput.value = values.join(', ');
                    init();
                }
                
                // Bubble sort algorithm visualization
                async function bubbleSort() {
                    isSorting = true;
                    startBtn.disabled = true;
                    resetBtn.disabled = true;
                    submitBtn.disabled = true;
                    randomBtn.disabled = true;
                    useDefaultBtn.disabled = true;
                    
                    const n = values.length;
                    const speed = 1100 - (speedControl.value * 100); // Convert to delay in ms
                    let swapped;
                    
                    do {
                        swapped = false;
                        
                        for (let i = 0; i < n - 1; i++) {
                            // Highlight the bars being compared
                            bars[i].classList.add('comparing');
                            bars[i + 1].classList.add('comparing');
                            await new Promise(resolve => setTimeout(resolve, speed / 2));
                            
                            if (values[i] > values[i + 1]) {
                                // Visualize swap
                                bars[i].classList.add('swapping');
                                bars[i + 1].classList.add('swapping');
                                await new Promise(resolve => setTimeout(resolve, speed / 2));
                                
                                // Swap values
                                [values[i], values[i + 1]] = [values[i + 1], values[i]];
                                
                                // Update bar heights
                                const maxValue = Math.max(...values);
                                bars[i].style.height = `${(values[i] / maxValue) * 100}%`;
                                bars[i + 1].style.height = `${(values[i + 1] / maxValue) * 100}%`;
                                
                                // Update labels
                                bars[i].querySelector('.bar-label').textContent = values[i];
                                bars[i + 1].querySelector('.bar-label').textContent = values[i + 1];
                                
                                swapped = true;
                                
                                // Remove swap highlight
                                bars[i].classList.remove('swapping');
                                bars[i + 1].classList.remove('swapping');
                                await new Promise(resolve => setTimeout(resolve, speed / 2));
                            }
                            
                            // Reset color if no swap
                            bars[i].classList.remove('comparing');
                            bars[i + 1].classList.remove('comparing');
                        }
                        
                        // Mark last element as sorted
                        bars[n - 1].classList.add('sorted');
                        
                    } while (swapped);
                    
                    // Mark all bars as sorted
                    bars.forEach(bar => {
                        bar.classList.add('sorted');
                    });
                    
                    isSorting = false;
                    startBtn.disabled = true;
                    resetBtn.disabled = false;
                    submitBtn.disabled = false;
                    randomBtn.disabled = false;
                    useDefaultBtn.disabled = false;
                }
                
                // Event listeners for sorting controls
                startBtn.addEventListener('click', bubbleSort);
                resetBtn.addEventListener('click', function() {
                    if (!isSorting) {
                        init();
                    }
                });
                
                // Initialize on load
                init();
            });
        