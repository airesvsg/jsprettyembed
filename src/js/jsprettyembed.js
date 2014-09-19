/* jsPrettyEmbed
 *
 * Author: Aires Gonçalves
 *
 * Usage: 
 *
 *      new jsPrettyEmebed(
 *          '#player-element',
 *          {
 *              videoID: 'myvideoid',
 *              previewSize: '',
 *              customPreviewImage: '',
 *              showInfo: true,
 *              showControls: true,
 *              loop: false,
 *              start: 10,
 *              closedCaptions: false,
 *              colorScheme: 'dark',
 *              showRelated: false,
 *              useFitVids: false
 *          }
 *      );
 *
 *
 * based on https://github.com/mike-zarandona/prettyembed.js
 * by Mike Zarandona
 */

function jsPrettyEmbed(elements, options) {
	'use strict';
	return this.init(elements, options);
}

(function (window, document) {
	'use strict';

	function extend (b, a) {
		var p;
		if (b === undefined) {
			return a;
		}
		for (p in a) {
			if (a.hasOwnProperty(p) && b.hasOwnProperty(p) === false) {
				b[p] = a[p];
			}
		}
		return b;
	}

	function addClass (o, c) {
		if (o.classList) {
			o.classList.add(c);
		} else {
		  o.className += ' ' + c;
		}
		return o;
	}

	function youtubeParser (v) {
        if(v.length == 11){
            return v;
        }
		var r = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
            m  = v.match(r);
		if (m && m[7].length == 11) {
			return m[7];
		}
	}

	function getPreviewSize (p) {
    	switch (p) {
			case 'thumb-default':
				return 'default';
			case 'thumb-1':
				return '1';
			case 'thumb-2':
				return '2';
			case 'thumb-3':
				return '3';
			case 'default':
				return 'mqdefault';
			case 'medium':
				return '0';
			case 'high':
				return 'hqdefault';
			default:
				return 'maxresdefault';
		}
    }

    // based on https://github.com/davatron5000/FitVids.js
    // by Chris Coyier
    function fitVids (e) {
        var sH = e.clientHeight,
            sW = e.clientWidth,
            aH = e.getAttribute('height'),
            aW = e.getAttribute('width'),
            css  = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';

        appendCSS('fit-vids-style', css);

        if ((!sH && !sW) && (isNaN(aH) || isNaN(aW))) {
            e.setAttribute('height', 9);
            e.setAttribute('width', 16);
        }

        var height = (e.tagName.toLowerCase() === 'object' || (aH && !isNaN(parseInt(aH, 10)))) ? parseInt(e.getAttribute('height'), 10) : sH,
            width  = !isNaN(parseInt(aW, 10)) ? parseInt(e.getAttribute('width'), 10) : sW,
            ratio  = height / width;

        e.removeAttribute('height');
        e.removeAttribute('width');

        var w = document.createElement('div');
        addClass(w, 'fluid-width-video-wrapper');
        w.style.paddingTop = (ratio * 100) + "%";
        w.innerHTML = e.innerHTML;
        e.innerHTML = w.outerHTML;
    }

    function appendCSS ( id, css ) {
        if (!document.getElementById(id)) {
            var head = document.head || document.getElementsByTagName('head')[0],
                div  = document.createElement('div');
            div.innerHTML = '<p>x</p><style id="' + id + '">' + css + '</style>';
            head.appendChild(div.childNodes[1]);
        }
    }

	jsPrettyEmbed.prototype = {

		defaults: {
			videoID: '',
			previewSize: '',
			customPreviewImage: '',
			showInfo: true,
			showControls: true,
			loop: false,
			closedCaptions: false,
			localization: '',
			colorScheme: 'dark',
			showRelated: false,
			allowFullScreen: true,
            fitVids: false,
            start: 0
		},
		
		init: function (elements, options) {
			this.setElements(elements);
			if (this.elements.length === 0) {
				return;
			}
			this.options = extend(options, this.defaults);
			return this.setup();
		},

		setup: function () {
			this.initElements()
				.bindClick()
                .appendCSS();
		},

		setElements: function (selector) {
			this.elements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
        },

        initElements: function () {
            var i;
            
            this.attributes = [];

        	for (i=0; i < this.elements.length; i++) {
        		var elm = this.elements[i],
        			videoID,
        			previewSize,
        			customPreviewImage,
					showInfo,
					showControls,
					loop,
                    start,
					closedCaptions,
					localization,
					colorScheme,
					showRelated,
					allowFullScreen,
                    fitVids;

        		if (elm.getAttribute('data-pe-videoid')) {
        			videoID = elm.getAttribute('data-pe-videoid');
        		} else if (elm.getAttribute('href')) {
        			videoID = youtubeParser(elm.getAttribute('href'));
        		} else {
        			videoID = this.options.videoID;
        		}

        		if (elm.getAttribute('data-pe-preview-size')) {
        			previewSize = elm.getAttribute('data-pe-preview-size');
        		} else if(this.options.previewSize !== undefined){
        			previewSize = this.options.previewSize;
        		}

        		if (elm.getAttribute('data-pe-custom-preview-image')) {
        			customPreviewImage = elm.getAttribute('data-pe-custom-preview-image');
        		} else if (this.options.customPreviewImage !== undefined) {
        			customPreviewImage = this.options.customPreviewImage;
        		}

        		if (elm.getAttribute('data-pe-show-info')) {
        			showInfo = elm.getAttribute('data-pe-show-info');
        		} else if (this.options.showInfo !== undefined) {
        			showInfo = this.options.showInfo;
        		}

        		if (elm.getAttribute('data-pe-show-controls')) {
        			showControls = elm.getAttribute('data-pe-show-controls');
        		} else if (this.options.showControls !== undefined) {
        			showControls = this.options.showControls;
        		}

        		if (elm.getAttribute('data-pe-loop')) {
        			loop = elm.getAttribute('data-pe-loop');
        		} else if (this.options.loop !== undefined) {
        			loop = this.options.loop;
        		}

                if (elm.getAttribute('data-pe-start')) {
                    start = elm.getAttribute('data-pe-start');
                } else if (this.options.start !== undefined) {
                    start = this.options.start;
                }

        		if (elm.getAttribute('data-pe-closed-captions')) {
        			closedCaptions = elm.getAttribute('data-pe-closed-captions');
        		} else if (this.options.closedCaptions  !== undefined) {
        			closedCaptions = this.options.closedCaptions;
        		}

        		if (elm.getAttribute('data-pe-localization')) {
        			localization = elm.getAttribute('data-pe-localization');
        		} else if (this.options.localization !== undefined) {
        			localization = this.options.localization;
        		}

        		if (elm.getAttribute('data-pe-color-scheme')) {
        			colorScheme = elm.getAttribute('data-pe-color-scheme');
        		} else if (this.options.colorScheme !== undefined) {
        			colorScheme = this.options.colorScheme;
        		}

        		if (elm.getAttribute('data-pe-show-related')) {
        			showRelated = elm.getAttribute('data-pe-show-related');
        		} else if (this.options.showRelated !== undefined) {
        			showRelated = this.options.showRelated;
        		}

        		if (elm.getAttribute('data-pe-allow-fullscreen')) {
        			allowFullScreen = elm.getAttribute('data-pe-allow-fullscreen');
        		} else if (this.options.allowFullScreen !== undefined) {
        			allowFullScreen = this.options.allowFullScreen.toString();
        		}

                if (elm.getAttribute('data-pe-fitvids')) {
                    fitVids = elm.getAttribute('data-pe-fitvids');
                }else{
                    fitVids = this.options.fitVids.toString();
                }

                if (elm.tagName.toLowerCase() === 'a') {
                    var parent = elm.parentNode,
                    wrap = document.createElement('div');
                    if (elm.getAttribute('id')) {
                        wrap.setAttribute('id', elm.getAttribute('id'));
                    }
                    if (elm.getAttribute('class')) {
                        wrap.setAttribute('class', elm.getAttribute('class'));
                    }
                    parent.replaceChild(wrap, elm);
                    elm = wrap;
                }
        		
                addClass(elm, 'pretty-embed');

        		elm.setAttribute('data-videoid', videoID);
                
                this.attributes.push({
                    'videoID' : videoID,
                    'previewSize' : previewSize,
                    'customPreviewImage' : customPreviewImage,
                    'showInfo': showInfo,
                    'showControls': showControls,
                    'loop' : loop,
                    'start' : parseInt(start),
                    'closedCaptions' : closedCaptions,
                    'localization' : localization,
                    'colorScheme' : colorScheme,
                    'showRelated' : showRelated,
                    'allowFullScreen' : allowFullScreen,
                    'fitVids' : fitVids
                });

        		if (customPreviewImage !== undefined && customPreviewImage !== '') {
        			elm.innerHTML = '<img src="' + customPreviewImage + '" width="100%" alt="" />';
        		} else {
        			previewSize = getPreviewSize(previewSize);
        			elm.innerHTML = '<img src="//img.youtube.com/vi/' + videoID + '/' + previewSize + '.jpg" width="100%" alt="" />';
        		}
        	}
            this.setElements('.pretty-embed');
        	return this;
        },

        bindClick: function () {
            var self = this,
        		i;
            for (i=0; i < this.elements.length; i++) {
                (function (i) {
                    self.elements[i].addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        self.clickEventRunner(i);
                    });
                })(i);
        	}
        	return this;
        },

        clickEventRunner: function (index) {
        	var element             = this.elements[index];

            if (element === undefined) {
        		console.error('jsPrettyEmbed.js error: invalid element with index: '+index);
                return;
            }

            var options             = this.attributes[index],
                image               = element.querySelector('img'),
                wrapperWidth        = image.offsetWidth,
                wrapperHeight       = image.offsetHeight,
                playerOptions       = '',
                allowFullScreenAttr = '',
                videoID;

            if (options.videoID.length === 11) {
                videoID = options.videoID;
            } else {
                console.error('jsPrettyEmbed.js error: Misformed or missing video ID.');                
        	}

        	if (options.showInfo === 'false' || options.showInfo === false) { 
        		playerOptions += '&showinfo=0'; 
        	}

        	if (options.showControls === 'false' || options.showControls === false) { 
        		playerOptions += '&controls=0'; 
        	}

            if (options.loop === 'true' || options.loop === true) {
                playerOptions += '&loop=1';
            }

            if (options.start > 0) {
                playerOptions += '&start='+options.start;
            }

			if (options.closedCaptions === 'true' || options.closedCaptions === true) { 
				playerOptions += '&cc_load_policy=1'; 
			}

			if (options.localization !== undefined) { 
				playerOptions += '&hl=' + options.localization; 
			}

			if (options.colorScheme === 'light') { 
				playerOptions += '&theme=light'; 
			}

            if (options.showRelated === 'false' || options.showRelated === false) {
                playerOptions += '&rel=0';
            }

			if (options.allowFullScreen === 'true' || options.allowFullScreen === true) {
                playerOptions += '&fs=1';
				allowFullScreenAttr = ' allowfullscreen ';
			}

			element.innerHTML = '<iframe width="' + wrapperWidth + '" height="' + wrapperHeight + '" ' + allowFullScreenAttr + ' style="border:none;" src="//www.youtube.com/embed/' + videoID + '?autoplay=1' + playerOptions + '"></iframe>';

			addClass(element, 'play');

            if (options.fitVids === 'true' || options.fitVids === true) {
                fitVids(element);
            }
        },

        appendCSS: function () {
            var css = '.pretty-embed{position:relative;cursor:pointer;display:block}.pretty-embed img{width:100%;height:auto}.pretty-embed iframe{border:0 solid transparent}.pretty-embed:after{display:block;content:"";position:absolute;top:50%;margin-top:-19px;left:50%;margin-left:-27px;width:54px;height:38px;background-image:url(data:image/png;base64,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);-webkit-background-size:cover;background-size:cover}.pretty-embed.play:after{display:none}.pretty-embed:hover:after{background-image:url(data:image/png;base64,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)}';
            appendCSS('js-pretty-embed-style', css);
        }

	};
}(window, document));