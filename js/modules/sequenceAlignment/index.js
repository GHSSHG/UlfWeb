// 序列比对模块

// 模块定义
const sequenceAlignmentModule = {
    id: 'module2',
    name: '序列比对模块',
    
    // 初始化模块
    init() {
        console.log('初始化序列比对模块');
        // 注册模块
        window.app.registerModule(this.id, this);
    },
    
    // 激活模块 - 当用户选择此模块时调用
    activate() {
        console.log('激活序列比对模块');
        
        // 获取内容容器
        const container = document.getElementById('moduleContainer');
        
        // 渲染模块UI
        container.innerHTML = `
            <div class="module-header">
                <h3>序列比对工具</h3>
                <p>上传序列文件或直接输入序列进行比对分析</p>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="sequence1" class="form-label">序列 1</label>
                        <textarea class="form-control" id="sequence1" rows="4" placeholder="输入序列或上传FASTA文件"></textarea>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-secondary" id="uploadSeq1Btn">上传文件</button>
                            <input type="file" id="seq1File" style="display:none">
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="sequence2" class="form-label">序列 2</label>
                        <textarea class="form-control" id="sequence2" rows="4" placeholder="输入序列或上传FASTA文件"></textarea>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-secondary" id="uploadSeq2Btn">上传文件</button>
                            <input type="file" id="seq2File" style="display:none">
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="alignmentMethod" class="form-label">比对算法</label>
                        <select class="form-control" id="alignmentMethod">
                            <option value="global">全局比对 (Needleman-Wunsch)</option>
                            <option value="local">局部比对 (Smith-Waterman)</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="scoringMatrix" class="form-label">评分矩阵</label>
                        <select class="form-control" id="scoringMatrix">
                            <option value="blosum62">BLOSUM62</option>
                            <option value="pam250">PAM250</option>
                            <option value="custom">自定义</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <button class="btn btn-success" id="startAlignmentBtn">开始比对</button>
            
            <div class="results-container mt-4" id="alignmentResultsContainer" style="display:none">
                <h4>比对结果</h4>
                <div class="alert alert-info">
                    <strong>比对得分:</strong> <span id="alignmentScore"></span>
                </div>
                
                <h5>比对视图</h5>
                <pre id="alignmentView" class="bg-light p-3 border"></pre>
                
                <div class="mt-3">
                    <button class="btn btn-outline-primary" id="downloadAlignmentBtn">
                        下载结果
                    </button>
                </div>
            </div>
        `;
        
        // 设置事件监听
        this.setupEventListeners();
    },
    
    // 模块停用 - 当用户切换到其他模块时调用
    deactivate() {
        console.log('停用序列比对模块');
        // 清理可能的资源
    },
    
    // 设置事件监听
    setupEventListeners() {
        // 序列1文件上传按钮
        document.getElementById('uploadSeq1Btn').addEventListener('click', () => {
            document.getElementById('seq1File').click();
        });
        
        // 序列1文件输入变化
        document.getElementById('seq1File').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.readSequenceFile(e.target.files[0], 'sequence1');
            }
        });
        
        // 序列2文件上传按钮
        document.getElementById('uploadSeq2Btn').addEventListener('click', () => {
            document.getElementById('seq2File').click();
        });
        
        // 序列2文件输入变化
        document.getElementById('seq2File').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.readSequenceFile(e.target.files[0], 'sequence2');
            }
        });
        
        // 开始比对按钮
        document.getElementById('startAlignmentBtn').addEventListener('click', () => {
            this.startAlignment();
        });
        
        // 下载结果按钮
        document.getElementById('downloadAlignmentBtn').addEventListener('click', () => {
            this.downloadResults();
        });
    },
    
    // 读取序列文件
    readSequenceFile(file, targetId) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            // 简单解析FASTA格式 (仅示例)
            const sequence = this.parseFasta(content);
            document.getElementById(targetId).value = sequence;
        };
        reader.readAsText(file);
    },
    
    // 简单FASTA解析器
    parseFasta(fastaContent) {
        // 移除注释行和标题行
        const lines = fastaContent.split('\n');
        const sequenceLines = lines.filter(line => !line.startsWith('>') && line.trim().length > 0);
        return sequenceLines.join('').trim();
    },
    
    // 开始序列比对
    startAlignment() {
        const sequence1 = document.getElementById('sequence1').value.trim();
        const sequence2 = document.getElementById('sequence2').value.trim();
        const method = document.getElementById('alignmentMethod').value;
        const matrix = document.getElementById('scoringMatrix').value;
        
        if (!sequence1 || !sequence2) {
            alert('请输入两个序列进行比对');
            return;
        }
        
        console.log(`开始序列比对，方法: ${method}, 矩阵: ${matrix}`);
        
        // 显示加载状态
        document.getElementById('startAlignmentBtn').disabled = true;
        document.getElementById('startAlignmentBtn').innerHTML = '比对中...';
        
        // 模拟比对过程
        setTimeout(() => {
            // 在实际应用中，这里应该调用真正的序列比对算法
            this.displayAlignmentResults({
                score: 78.5,
                alignedSequences: [
                    'ATGCTAGCTAGCTGACT--GCATGCATGCAT',
                    '||||| || ||||||||  ||||||| ||||',
                    'ATGCT-GC-AGCTGACTAGGCATGCA-GCAT'
                ]
            });
        }, 1500);
    },
    
    // 显示比对结果
    displayAlignmentResults(results) {
        document.getElementById('startAlignmentBtn').disabled = false;
        document.getElementById('startAlignmentBtn').innerHTML = '开始比对';
        
        // 显示结果容器
        const resultsContainer = document.getElementById('alignmentResultsContainer');
        resultsContainer.style.display = 'block';
        
        // 显示比对得分
        document.getElementById('alignmentScore').textContent = results.score;
        
        // 显示比对视图
        document.getElementById('alignmentView').textContent = results.alignedSequences.join('\n');
        
        // 保存结果用于下载
        this.alignmentResults = results;
    },
    
    // 下载比对结果
    downloadResults() {
        if (!this.alignmentResults) {
            alert('无可下载的比对结果');
            return;
        }
        
        // 创建文本内容
        const content = [
            '# 序列比对结果',
            `# 比对得分: ${this.alignmentResults.score}`,
            '',
            ...this.alignmentResults.alignedSequences
        ].join('\n');
        
        // 创建下载链接
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', '序列比对结果.txt');
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// 导出模块
export default sequenceAlignmentModule; 