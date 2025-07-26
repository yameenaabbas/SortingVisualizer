
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
            const defaultValues = [38, 27, 43, 3, 9, 82, 10];
            
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
            
            // Merge sort algorithm visualization
            async function mergeSort() {
                startBtn.disabled = true;
                resetBtn.disabled = true;
                submitBtn.disabled = true;
                randomBtn.disabled = true;
                useDefaultBtn.disabled = true;
                
                const speed = 1100 - (speedControl.value * 100); // Convert to delay in ms
                
                await mergeSortHelper(0, values.length - 1);
                
                // Mark all bars as sorted at the end
                for (let i = 0; i < values.length; i++) {
                    bars[i].classList.add('sorted');
                    await new Promise(resolve => setTimeout(resolve, speed/2));
                }
                
                startBtn.disabled = true;
                resetBtn.disabled = false;
                submitBtn.disabled = false;
                randomBtn.disabled = false;
                useDefaultBtn.disabled = false;
            }
            
            // Recursive merge sort helper
            async function mergeSortHelper(l, r) {
                if (l >= r) return;
                
                const m = Math.floor(l + (r - l) / 2);
                
                // Visualize the current partition
                for (let i = l; i <= r; i++) {
                    if (i <= m) {
                        bars[i].classList.add('left-partition');
                    } else {
                        bars[i].classList.add('right-partition');
                    }
                }
                await new Promise(resolve => setTimeout(resolve, speedControl.value * 100));
                
                // Recursively sort left and right halves
                await mergeSortHelper(l, m);
                await mergeSortHelper(m + 1, r);
                
                // Merge the sorted halves
                await merge(l, m, r);
                
                // Remove partition colors
                for (let i = l; i <= r; i++) {
                    bars[i].classList.remove('left-partition', 'right-partition');
                }
            }
            
            // Merge two sorted subarrays
            async function merge(l, m, r) {
                const speed = 1100 - (speedControl.value * 100);
                const n1 = m - l + 1;
                const n2 = r - m;
                
                // Create temp arrays
                const L = new Array(n1);
                const R = new Array(n2);
                
                // Copy data to temp arrays
                for (let i = 0; i < n1; i++) {
                    L[i] = values[l + i];
                }
                for (let j = 0; j < n2; j++) {
                    R[j] = values[m + 1 + j];
                }
                
                // Merge the temp arrays back
                let i = 0, j = 0, k = l;
                
                while (i < n1 && j < n2) {
                    // Highlight the elements being compared
                    if (l + i <= m) bars[l + i].classList.add('comparing');
                    if (m + 1 + j <= r) bars[m + 1 + j].classList.add('comparing');
                    await new Promise(resolve => setTimeout(resolve, speed/2));
                    
                    if (L[i] <= R[j]) {
                        values[k] = L[i];
                        updateBar(k, values[k]);
                        bars[k].classList.add('current-merge');
                        await new Promise(resolve => setTimeout(resolve, speed/2));
                        i++;
                    } else {
                        values[k] = R[j];
                        updateBar(k, values[k]);
                        bars[k].classList.add('current-merge');
                        await new Promise(resolve => setTimeout(resolve, speed/2));
                        j++;
                    }
                    
                    // Remove highlights
                    if (l + i - 1 <= m) bars[l + i - 1].classList.remove('comparing');
                    if (m + j <= r) bars[m + j].classList.remove('comparing');
                    bars[k].classList.remove('current-merge');
                    k++;
                }
                
                // Copy remaining elements of L[]
                while (i < n1) {
                    values[k] = L[i];
                    updateBar(k, values[k]);
                    bars[k].classList.add('current-merge');
                    await new Promise(resolve => setTimeout(resolve, speed/2));
                    bars[k].classList.remove('current-merge');
                    i++;
                    k++;
                }
                
                // Copy remaining elements of R[]
                while (j < n2) {
                    values[k] = R[j];
                    updateBar(k, values[k]);
                    bars[k].classList.add('current-merge');
                    await new Promise(resolve => setTimeout(resolve, speed/2));
                    bars[k].classList.remove('current-merge');
                    j++;
                    k++;
                }
                
                // Mark this segment as sorted
                for (let i = l; i <= r; i++) {
                    bars[i].classList.add('sorted');
                }
                await new Promise(resolve => setTimeout(resolve, speed/2));
            }
            
            // Update bar height and label
            function updateBar(index, value) {
                const maxValue = Math.max(...values);
                bars[index].style.height = `${(value / maxValue) * 100}%`;
                bars[index].querySelector('.bar-label').textContent = value;
            }
            
            // Event listeners for sorting controls
            startBtn.addEventListener('click', mergeSort);
            resetBtn.addEventListener('click', init);
            
            // Initialize on load
            init();
        });
    