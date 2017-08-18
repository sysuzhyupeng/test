var COMMON = {
	fnSetPicSize(src,width,height) {
		if(src.indexOf('i.ytimg.com') == -1) {
		    let self = this;
		    var url = "";
		    if(src.indexOf('_') != -1) {
			    url = src.substring(0,src.length - 12);
		    } else {
			    url = src.substring(0,src.length - 4);
		    }
		    var jpg = src.slice(-4);
			var pic_url = url + "_" + width + "_" + height+jpg
		    return pic_url 
		} else {
		    return src 
		}

	}
};
export default COMMON;