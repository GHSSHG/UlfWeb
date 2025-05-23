// 文件处理工具函数

/**
 * 解析上传的文件内容
 * @param {File} file - 上传的文件对象
 * @param {string} format - 文件格式 (fasta, txt, csv)
 * @returns {Promise<Array>} - 解析后的数据数组
 */
export async function parseFile(file, format) {
    // 文件读取逻辑（实际实现将在此处）
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            let data = [];
            
            // 根据不同格式处理数据
            switch(format) {
                case 'fasta':
                    // FASTA格式解析逻辑
                    data = parseFasta(content);
                    break;
                case 'csv':
                    // CSV格式解析逻辑
                    data = parseCSV(content);
                    break;
                default:
                    // TXT及其他格式解析逻辑
                    data = content.split('\n').filter(line => line.trim());
            }
            
            resolve(data);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

/**
 * 解析FASTA格式内容
 * @param {string} content - FASTA文件内容
 * @returns {Array} - 序列对象数组 [{header, sequence}, ...]
 */
function parseFasta(content) {
    // FASTA解析逻辑（简化实现）
    const sequences = [];
    let currentHeader = '';
    let currentSeq = '';
    
    content.split('\n').forEach(line => {
        if (line.startsWith('>')) {
            if (currentSeq) {
                sequences.push({ header: currentHeader, sequence: currentSeq });
            }
            currentHeader = line.substring(1).trim();
            currentSeq = '';
        } else if (line.trim()) {
            currentSeq += line.trim();
        }
    });
    
    if (currentSeq) {
        sequences.push({ header: currentHeader, sequence: currentSeq });
    }
    
    return sequences;
}

/**
 * 解析CSV格式内容
 * @param {string} content - CSV文件内容
 * @returns {Array} - 数据数组
 */
function parseCSV(content) {
    // CSV解析逻辑（简化实现）
    return content.split('\n')
        .filter(line => line.trim())
        .map(line => line.split(',').map(cell => cell.trim()));
}

/**
 * 下载数据为文件
 * @param {Object} data - 要下载的数据
 * @param {string} format - 下载格式 (csv, json, txt)
 * @param {string} filename - 文件名
 */
export function downloadData(data, format, filename) {
    // 数据下载逻辑（实际实现将在此处）
    let content = '';
    let mimeType = '';
    
    switch(format) {
        case 'json':
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            break;
        case 'csv':
            // 转换为CSV格式
            mimeType = 'text/csv';
            break;
        default:
            // 纯文本格式
            content = data.toString();
            mimeType = 'text/plain';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
} 