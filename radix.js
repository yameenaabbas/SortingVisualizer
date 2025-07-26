document.addEventListener('DOMContentLoaded', function() {
            const barsContainer = document.getElementById('barsContainer');
            const startBtn = document.getElementById('startBtn');
            const stepBtn = document.getElementById('stepBtn');
            const resetBtn = document.getElementById('resetBtn');
            const speedControl = document.getElementById('speed');
            const numberInput = document.getElementById('numberInput');
            const submitBtn = document.getElementById('submitBtn');
            const randomBtn = document.getElementById('randomBtn');
            const useDefaultBtn = document.getElementById('useDefaultBtn');
            const errorMessage = document.getElementById('errorMessage');
            const digitInfo = document.getElementById('digitInfo');
            
            let bars = [];
            let values = [];
            const defaultValues = [170, 45, 75, 90, 802, 24, 2, 66];
            
            // Sorting state variables
            let sorting = false;
            let currentStep = 0;
            let maxDigits = 0;
            let currentDigit = 0;
            let exp = 1;
            let count = [];
            let output = [];
            let i = 0;
            
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
                stepBtn.disabled = values.length === 0;
                resetBtn.disabled = values.length === 0;
                
                // Reset sorting state
                sorting = false;
                currentStep = 0;
                digitInfo.textContent = "Current Digit: -";
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
                values = Array.from({length: count}, () => Math.floor(Math.random() * 1000));
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
            
            // Get the maximum number of digits in the array
            function getMaxDigits() {
                const max = Math.max(...values);
                return max.toString().length;
            }
            
            // Get digit at specific position (0 is least significant digit)
            function getDigit(num, pos) {
                return Math.floor(num / Math.pow(10, pos)) % 10;
            }
            
            // Radix sort algorithm visualization
            async function radixSort() {
                startBtn.disabled = true;
                stepBtn.disabled = true;
                resetBtn.disabled = true;
                submitBtn.disabled = true;
                randomBtn.disabled = true;
                useDefaultBtn.disabled = true;
                
                const speed = 1100 - (speedControl.value * 100); // Convert to delay in ms
                
                // Find the maximum number to know number of digits
                const max = Math.max(...values);
                maxDigits = max.toString().length;
                
                // Do counting sort for every digit
                for (currentDigit = 0; currentDigit < maxDigits; currentDigit++) {
                    digitInfo.textContent = `Current Digit: ${currentDigit + 1} (${maxDigits} total digits)`;
                    
                    // Highlight all bars with the current digit
                    for (let i = 0; i < values.length; i++) {
                        const digit = getDigit(values[i], currentDigit);
                        bars[i].classList.add(`bucket-${digit}`);
                        bars[i].classList.add('current-digit');
                        await new Promise(resolve => setTimeout(resolve, speed/2));
                    }
                    
                    // Perform counting sort for current digit
                    await countingSortForDigit(currentDigit);
                    
                    // Remove highlights
                    for (let i = 0; i < values.length; i++) {
                        const digit = getDigit(values[i], currentDigit);
                        bars[i].classList.remove(`bucket-${digit}`);
                        bars[i].classList.remove('current-digit');
                        await new Promise(resolve => setTimeout(resolve, speed/4));
                    }
                }
                
                // Mark all bars as sorted at the end
                for (let i = 0; i < values.length; i++) {
                    bars[i].classList.add('sorted');
                    await new Promise(resolve => setTimeout(resolve, speed/2));
                }
                
                digitInfo.textContent = "Sorting complete!";
                startBtn.disabled = true;
                stepBtn.disabled = true;
                resetBtn.disabled = false;
                submitBtn.disabled = false;
                randomBtn.disabled = false;
                useDefaultBtn.disabled = false;
            }
            
            // Counting sort for a specific digit
            async function countingSortForDigit(digitPos) {
                const speed = 1100 - (speedControl.value * 100);
                const n = values.length;
                const exp = Math.pow(10, digitPos);
                
                // The output array that will have sorted values
                output = new Array(n);
                
                // Initialize count array
                count = new Array(10).fill(0);
                
                // Store count of occurrences in count[]
                for (i = 0; i < n; i++) {
                    const digit = Math.floor(values[i] / exp) % 10;
                    count[digit]++;
                    
                    // Visualize the counting
                    bars[i].classList.add('comparing');
                    await new Promise(resolve => setTimeout(resolve, speed));
                    bars[i].classList.remove('comparing');
                }
                
                // Change count[i] so that count[i] now contains
                // actual position of this digit in output[]
                for (i = 1; i < 10; i++) {
                    count[i] += count[i - 1];
                }
                
                // Build the output array
                for (i = n - 1; i >= 0; i--) {
                    const digit = Math.floor(values[i] / exp) % 10;
                    output[count[digit] - 1] = values[i];
                    count[digit]--;
                    
                    // Visualize the placement
                    bars[i].classList.add('comparing');
                    await new Promise(resolve => setTimeout(resolve, speed));
                    bars[i].classList.remove('comparing');
                }
                
                // Copy the output array to values[], so that values[] now
                // contains sorted numbers according to current digit
                for (i = 0; i < n; i++) {
                    values[i] = output[i];
                    updateBar(i, values[i]);
                    bars[i].classList.add('sorted');
                    await new Promise(resolve => setTimeout(resolve, speed/2));
                    bars[i].classList.remove('sorted');
                }
            }
            
            // Update bar height and label
            function updateBar(index, value) {
                const maxValue = Math.max(...values);
                bars[index].style.height = `${(value / maxValue) * 100}%`;
                bars[index].querySelector('.bar-label').textContent = value;
            }
            
            // Event listeners for sorting controls
            startBtn.addEventListener('click', radixSort);
            resetBtn.addEventListener('click', init);
            
            // Initialize on load
            init();
        });