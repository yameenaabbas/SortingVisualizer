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
            const partitionInfo = document.getElementById('partitionInfo');
            
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
                partitionInfo.textContent = '';
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
            
            // Quick sort algorithm visualization
            async function quickSort() {
                isSorting = true;
                startBtn.disabled = true;
                resetBtn.disabled = true;
                submitBtn.disabled = true;
                randomBtn.disabled = true;
                useDefaultBtn.disabled = true;
                
                const speed = 1100 - (speedControl.value * 100); // Convert to delay in ms
                await quickSortHelper(0, values.length - 1, speed);
                
                // Mark all bars as sorted at the end
                for (let i = 0; i < bars.length; i++) {
                    bars[i].classList.add('sorted');
                    await new Promise(resolve => setTimeout(resolve, speed/4));
                }
                
                partitionInfo.textContent = "Sorting complete!";
                
                isSorting = false;
                startBtn.disabled = true;
                resetBtn.disabled = false;
                submitBtn.disabled = false;
                randomBtn.disabled = false;
                useDefaultBtn.disabled = false;
            }
            
            async function quickSortHelper(low, high, speed) {
                if (low < high) {
                    // Partition the array and get the pivot index
                    const pivotIndex = await partition(low, high, speed);
                    
                    // Recursively sort elements before and after partition
                    await quickSortHelper(low, pivotIndex - 1, speed);
                    await quickSortHelper(pivotIndex + 1, high, speed);
                } else if (low === high) {
                    // Single element is already sorted
                    bars[low].classList.add('sorted');
                    await new Promise(resolve => setTimeout(resolve, speed/2));
                }
            }
            
            async function partition(low, high, speed) {
                // Choose the rightmost element as pivot
                const pivotValue = values[high];
                bars[high].classList.add('pivot');
                partitionInfo.textContent = `Partitioning from index ${low} to ${high} with pivot ${pivotValue}`;
                await new Promise(resolve => setTimeout(resolve, speed));
                
                let i = low - 1;
                
                for (let j = low; j < high; j++) {
                    // Highlight the current element being compared
                    bars[j].classList.add('partition');
                    await new Promise(resolve => setTimeout(resolve, speed/2));
                    
                    if (values[j] < pivotValue) {
                        i++;
                        
                        // Highlight elements being swapped
                        if (i !== j) {
                            bars[i].classList.add('comparing');
                            bars[j].classList.add('comparing');
                            partitionInfo.textContent = `Swapping ${values[i]} and ${values[j]}`;
                            await new Promise(resolve => setTimeout(resolve, speed/2));
                        }
                        
                        // Swap elements
                        [values[i], values[j]] = [values[j], values[i]];
                        
                        // Update bar heights and labels
                        updateBar(i, values[i]);
                        updateBar(j, values[j]);
                        
                        // Remove highlights
                        if (i !== j) {
                            bars[i].classList.remove('comparing');
                            bars[j].classList.remove('comparing');
                            await new Promise(resolve => setTimeout(resolve, speed/2));
                        }
                    }
                    
                    // Remove partition highlight
                    bars[j].classList.remove('partition');
                }
                
                // Swap pivot with element at i+1
                bars[i+1].classList.add('comparing');
                bars[high].classList.add('comparing');
                partitionInfo.textContent = `Placing pivot ${pivotValue} at position ${i+1}`;
                await new Promise(resolve => setTimeout(resolve, speed));
                
                [values[i + 1], values[high]] = [values[high], values[i + 1]];
                
                // Update bar heights and labels
                updateBar(i + 1, values[i + 1]);
                updateBar(high, values[high]);
                
                // Remove highlights
                bars[i+1].classList.remove('comparing');
                bars[high].classList.remove('comparing', 'pivot');
                
                // Mark pivot position as sorted
                bars[i + 1].classList.add('sorted');
                partitionInfo.textContent = `Pivot ${pivotValue} correctly placed at index ${i+1}`;
                await new Promise(resolve => setTimeout(resolve, speed));
                
                return i + 1;
            }
            
            function updateBar(index, value) {
                const maxValue = Math.max(...values);
                bars[index].style.height = `${(value / maxValue) * 100}%`;
                bars[index].querySelector('.bar-label').textContent = value;
            }
            
            // Event listeners for sorting controls
            startBtn.addEventListener('click', quickSort);
            resetBtn.addEventListener('click', function() {
                if (!isSorting) {
                    init();
                }
            });
            
            // Initialize on load
            init();
        });