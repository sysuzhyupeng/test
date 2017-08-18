/* seoConfig.js */

'use strict';

//SEO數據：title、keywords、description
function render(template, context) {

    var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

    return template.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {  
            return word.replace('\\', '');
        }

        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;

        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    })
};
String.prototype.render = function (context) {
    return render(this, context);
};

var seoConfig = function(page, value1, value2, value3, value4, value5) {
	var config = {
        topicList: {
            title: "【深度解析】專業評測文章-最車款評測-8891新車觸屏版",
            keywords: "編輯試駕,汽車評價,油耗,加速時間,煞停表現,汽車動力,汽車操控,空間,價格,8891新車觸屏版",
            description: "8891新車觸屏版深度解析，為您提供最專業的試駕，對汽車外觀、內裝、安全、空間、操控、動力、操控等進行專業試駕評測。"
        },
		topic: {
			title: "{brandName} {kindName} 深度解析 - 8891新車".render({
				brandName: value1,
				kindName: value2
			}),
			keywords: "{kindName},{brandName},深度解析,試駕,測評,試車,8891新車觸屏版".render({
				brandName: value1,
				kindName: value2
			}),
			description: "{kindName}深度解析，編輯對{kindName}的外觀、內裝、安全、空間、操控、動力、操控等進行專業試駕評測。".render({
                'kindName': value2
            })
		},
		articledetails: {
			title: "【圖】{artcleTitle} - {typeName} - 8891新車觸屏版".render({
				artcleTitle: value1,
                typeName: value4
			}),
			keywords: "{typeName},{tag},手機新聞".render({
				typeName: value4,
                tag: value5
			}),
			description: "{descript}".render({
				descript: value3
			})
		},
        compareSpec: {
            title: "【車型比較】 - 8891新車觸屏版",
            keywords: "車型比較,價格比較,車身尺碼比較,配備比較,外觀配備比較,內裝配備比較,觸屏版8891新車",
            description: "8891新車觸屏版為您提供不同車型詳細的規格配備比較、價格比較、外觀配備比較、內裝配備比較等，幫助您篩選對比出您心儀的車型。"
        }
	};
	var seoContent = config[page];

	document.getElementById('seo-title').innerHTML = seoContent.title;
	document.getElementById('seo-keywords').setAttribute('content', seoContent.keywords);
	document.getElementById('seo-description').setAttribute('content', seoContent.description);
};

module.exports = seoConfig;