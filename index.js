var fs        = require('fs');
var tesseract = require('node-tesseract');
var gm        = require('gm');

/**
 * 对图片进行阈值处理(默认55)
 */
function disposeImg (imgPath, newPath, thresholdValue) {
  return new Promise((resolve, reject) => {
    gm(imgPath)
      .threshold(thresholdValue || 55)
      .write(newPath, (err)=> {
        if (err) return reject(err);
        resolve(newPath);
      });
  });
}

/**
 * 识别阈值化后图片内容
 */
function recognizeImg (imgPath, options) {
  options = Object.assign({psm: 8}, options);
  // options = Object.assign({l: 'chi_sim'}, options); // 识别中文

  return new Promise((resolve, reject) => {
    tesseract
      .process(imgPath, options, (err, text) => {
        if (err) return reject(err);
        resolve(text.replace(/[\r\n\s]/gm, '')); // 去掉识别结果中的换行回车空格
      });
  });
}

async function recognize(imgPath, newPath, thresholdValue) {
  try {
    const newImgPath = await disposeImg(imgPath, newPath, thresholdValue)
    const result = await recognizeImg(newImgPath)
    console.log(`识别结果:${result}`)
  } catch (err) {
    console.error(`识别失败:${err}`);
  }
}

recognize('1.jpg', 'test_1.jpg')