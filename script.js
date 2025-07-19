// Sample code snippets
const sampleCodes = {
    fibonacci: `function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function optimizedFibo(n) {
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        [a, b] = [b, a + b];
    }
    return n === 0 ? a : b;
}`,
    sorting: `function quickSort(arr) {
    if (arr.length <= 1) return arr;
    
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const middle = arr.filter(x => x === pivot);
    const right = arr.filter(x => x > pivot);
    
    return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
    recursive: `function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function isPalindrome(str) {
    if (str.length <= 1) return true;
    if (str[0] !== str[str.length - 1]) return false;
    return isPalindrome(str.slice(1, -1));
}`,
    complex: `class DataProcessor {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
    }
    
    async processData(data) {
        try {
            for (let item of data) {
                if (this.isValid(item)) {
                    const processed = await this.transform(item);
                    if (this.shouldCache(processed)) {
                        this.cache.set(item.id, processed);
                    }
                } else {
                    throw new Error('Invalid data');
                }
            }
        } catch (error) {
            this.handleError(error);
        }
    }
}`
};

// Initialize floating particles
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        container.appendChild(particle);
    }
}

function loadSample(type) {
    document.getElementById('codeInput').value = sampleCodes[type];
}

function analyzeCode() {
    const code = document.getElementById('codeInput').value;
    const language = document.getElementById('languageSelect').value;
    
    if (!code.trim()) {
        alert('Please enter some code to analyze!');
        return;
    }

    // Perform analysis
    const analysis = performCodeAnalysis(code, language);
    displayResults(analysis);
}

function performCodeAnalysis(code, language) {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim() !== '').length;
    
    // Calculate various complexity metrics
    const cyclomaticComplexity = calculateCyclomaticComplexity(code);
    const cognitiveComplexity = calculateCognitiveComplexity(code);
    const nestingDepth = calculateNestingDepth(code);
    const functionCount = countFunctions(code);
    const variableCount = countVariables(code);
    const commentRatio = calculateCommentRatio(code);
    
    return {
        linesOfCode: lines.length,
        nonEmptyLines,
        cyclomaticComplexity,
        cognitiveComplexity,
        nestingDepth,
        functionCount,
        variableCount,
        commentRatio,
        language
    };
}

function calculateCyclomaticComplexity(code) {
    const patterns = [/if\s*\(/, /else/, /while\s*\(/, /for\s*\(/, /case\s/, /catch\s*\(/, /\?\s*.*:/, /&&/, /\|\|/];
    let complexity = 1; // Base complexity
    
    patterns.forEach(pattern => {
        const matches = code.match(new RegExp(pattern.source, 'g'));
        if (matches) complexity += matches.length;
    });
    
    return Math.min(complexity, 50); // Cap at 50 for visualization
}

function calculateCognitiveComplexity(code) {
    let complexity = 0;
    let nestingLevel = 0;
    
    const lines = code.split('\n');
    lines.forEach(line => {
        const trimmed = line.trim();
        
        // Increase nesting
        if (trimmed.match(/\{/) && !trimmed.match(/\}/)) {
            nestingLevel++;
        }
        
        // Decrease nesting
        if (trimmed.match(/\}/) && !trimmed.match(/\{/)) {
            nestingLevel = Math.max(0, nestingLevel - 1);
        }
        
        // Add complexity based on control structures
        if (trimmed.match(/if\s*\(|while\s*\(|for\s*\(|catch\s*\(/)) {
            complexity += 1 + nestingLevel;
        }
    });
    
    return complexity;
}

function calculateNestingDepth(code) {
    let maxDepth = 0;
    let currentDepth = 0;
    
    for (let char of code) {
        if (char === '{') {
            currentDepth++;
            maxDepth = Math.max(maxDepth, currentDepth);
        } else if (char === '}') {
            currentDepth = Math.max(0, currentDepth - 1);
        }
    }
    
    return maxDepth;
}

function countFunctions(code) {
    const patterns = [/function\s+\w+/, /\w+\s*:\s*function/, /=>\s*{/, /def\s+\w+/, /public\s+\w+\s+\w+\s*\(/];
    let count = 0;
    
    patterns.forEach(pattern => {
        const matches = code.match(new RegExp(pattern.source, 'g'));
        if (matches) count += matches.length;
    });
    
    return count;
}

function countVariables(code) {
    const patterns = [/\b(let|const|var)\s+\w+/, /\w+\s*=/, /int\s+\w+/, /string\s+\w+/];
    let count = 0;
    
    patterns.forEach(pattern => {
        const matches = code.match(new RegExp(pattern.source, 'g'));
        if (matches) count += matches.length;
    });
    
    return count;
}

function calculateCommentRatio(code) {
    const lines = code.split('\n');
    const commentLines = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*') || trimmed.startsWith('*');
    }).length;
    
    return lines.length > 0 ? (commentLines / lines.length * 100).toFixed(1) : 0;
}

function displayResults(analysis) {
    document.getElementById('resultsContainer').style.display = 'grid';
    document.getElementById('insightsSection').style.display = 'block';
    
    displayMetrics(analysis);
    createVisualization(analysis);
    generateInsights(analysis);
}

function displayMetrics(analysis) {
    const metrics = [
        { label: 'Lines of Code', value: analysis.linesOfCode, color: 'linear-gradient(45deg, #4299e1, #63b3ed)' },
        { label: 'Cyclomatic Complexity', value: analysis.cyclomaticComplexity, color: getComplexityColor(analysis.cyclomaticComplexity) },
        { label: 'Cognitive Complexity', value: analysis.cognitiveComplexity, color: getComplexityColor(analysis.cognitiveComplexity) },
        { label: 'Max Nesting Depth', value: analysis.nestingDepth, color: getNestingColor(analysis.nestingDepth) },
        { label: 'Function Count', value: analysis.functionCount, color: 'linear-gradient(45deg, #9f7aea, #b794f6)' },
        { label: 'Variable Count', value: analysis.variableCount, color: 'linear-gradient(45deg, #38b2ac, #4fd1c7)' },
        { label: 'Comment Ratio', value: analysis.commentRatio + '%', color: getCommentColor(parseFloat(analysis.commentRatio)) }
    ];
    
    const content = metrics.map(metric => `
        <div class="metric-item">
            <span class="metric-label">${metric.label}</span>
            <span class="metric-value" style="background: ${metric.color}">${metric.value}</span>
        </div>
    `).join('');
    
    document.getElementById('metricsContent').innerHTML = content;
}

function getComplexityColor(complexity) {
    if (complexity <= 5) return 'linear-gradient(45deg, #48bb78, #68d391)';
    if (complexity <= 10) return 'linear-gradient(45deg, #ed8936, #f6ad55)';
    return 'linear-gradient(45deg, #f56565, #fc8181)';
}

function getNestingColor(depth) {
    if (depth <= 3) return 'linear-gradient(45deg, #48bb78, #68d391)';
    if (depth <= 5) return 'linear-gradient(45deg, #ed8936, #f6ad55)';
    return 'linear-gradient(45deg, #f56565, #fc8181)';
}

function getCommentColor(ratio) {
    if (ratio >= 20) return 'linear-gradient(45deg, #48bb78, #68d391)';
    if (ratio >= 10) return 'linear-gradient(45deg, #ed8936, #f6ad55)';
    return 'linear-gradient(45deg, #f56565, #fc8181)';
}

function createVisualization(analysis) {
    const container = d3.select('#complexityViz');
    container.selectAll('*').remove();
    
    const width = 400;
    const height = 400;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Create nodes representing different aspects of complexity
    const nodes = [
        { id: 'main', label: 'Code', value: analysis.linesOfCode, x: width/2, y: height/2, fixed: true },
        { id: 'cyclomatic', label: 'Cyclomatic', value: analysis.cyclomaticComplexity, color: '#4299e1' },
        { id: 'cognitive', label: 'Cognitive', value: analysis.cognitiveComplexity, color: '#9f7aea' },
        { id: 'nesting', label: 'Nesting', value: analysis.nestingDepth, color: '#ed8936' },
        { id: 'functions', label: 'Functions', value: analysis.functionCount, color: '#38b2ac' },
        { id: 'variables', label: 'Variables', value: analysis.variableCount, color: '#48bb78' }
    ];
    
    const links = nodes.slice(1).map(node => ({ source: 'main', target: node.id }));
    
    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(80))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => Math.sqrt(d.value) * 3 + 10));
    
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('class', 'link');
    
    const node = svg.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', d => Math.sqrt(d.value) * 3 + 5)
        .attr('fill', d => d.color || '#667eea')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    const label = svg.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .text(d => d.label)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e2e8f0')
        .attr('dy', 4);
    
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        label
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    });
    
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function generateInsights(analysis) {
    const insights = [];
    
    // Complexity insights
    if (analysis.cyclomaticComplexity <= 5) {
        insights.push({ type: 'good', text: '✅ Low cyclomatic complexity - your code is easy to understand and test.' });
    } else if (analysis.cyclomaticComplexity <= 10) {
        insights.push({ type: 'warning', text: '⚠️ Moderate complexity - consider breaking down complex functions.' });
    } else {
        insights.push({ type: 'error', text: '❌ High complexity detected - refactoring recommended for maintainability.' });
    }
    
    // Nesting insights
    if (analysis.nestingDepth <= 3) {
        insights.push({ type: 'good', text: '✅ Good nesting depth - code structure is clean and readable.' });
    } else {
        insights.push({ type: 'warning', text: '⚠️ Deep nesting detected - consider extracting nested logic into separate functions.' });
    }
    
    // Comment insights
    const commentRatio = parseFloat(analysis.commentRatio);
    if (commentRatio >= 20) {
        insights.push({ type: 'good', text: '✅ Well-documented code with good comment coverage.' });
    } else if (commentRatio >= 10) {
        insights.push({ type: 'warning', text: '⚠️ Consider adding more comments to explain complex logic.' });
    } else {
        insights.push({ type: 'error', text: '❌ Low comment ratio - add documentation to improve code maintainability.' });
    }
    
    // Function insights
    if (analysis.functionCount === 0) {
        insights.push({ type: 'warning', text: '⚠️ No functions detected - consider organizing code into reusable functions.' });
    } else if (analysis.functionCount > 0) {
        insights.push({ type: 'good', text: `✅ Good modularization with ${analysis.functionCount} functions detected.` });
    }
    
    const content = insights.map(insight => `
        <div class="insight-item insight-${insight.type}">
            ${insight.text}
        </div>
    `).join('');
    
    document.getElementById('insightsContent').innerHTML = content;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Add some sample code on load
    document.getElementById('codeInput').value = sampleCodes.fibonacci;
});