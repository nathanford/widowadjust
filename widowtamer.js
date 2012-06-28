// Widow Tamer JS by Nathan C. Ford http://artequalswork.com

wt = {
	
	// default options
	opts : {
		elements : 'p,li,dd',
		chars : 14,
		method : 'wordSpacing',
		dir : 'pos',
		event : 'orientationchange'
	},
	
	to : new Array(),
	
	fix : function (opts) { 
		
		if (document.readyState === 'complete') wt.init(opts);
		wt.bind('load', function () { wt.init(opts); }); 
	
	},
	
	init : function (opts) {
	
		var m = opts.method;
		
		switch (m) {
			
			case 'padding-right': case 'nbsp': case 'padding-left': case 'word-spacing': case 'letter-spacing' : case undefined :
			
				if (opts.dir == 'neg' && m && m.match('padding')) { 
					
					console.log('Invalid method. You cannot use neg with padding.'); 
					
				} else wt.hunter(opts);
				
				break;
			
			default : console.log('Invalid method. Please use either padding-right, padding-left, word-spacing, or letter-spacing.'); 
		
		}
	
	},
	
	hunter : function (uopts) {
		
		var opts = new Object();
		
		// overwrite defaults with options from user
		if (uopts) {
		
			for(i in wt.opts) {
				
				if (uopts[i]) opts[i] = (i == 'method' && uopts[i].match('-')) ? wt.fixmethod(uopts[i]) : uopts[i];
				else opts[i] = wt.opts[i];
			
			}
		
		}
		else opts = wt.opts;
		
		if (document.querySelectorAll) {
		
			var eles = document.querySelectorAll(opts.elements),
				i = 0;
			
			while (i < eles.length) {
			
				var t = eles[i];
					
				if (t.offsetHeight > wt.getstyle(t, 'line-height', true)) { 
					
					// find a textnode longer than chars
					var nodes = t.childNodes,
						j = nodes.length - 1,
						c = false;
					
					while (j >= 0) {
						
						var ntext = wt.text(nodes[j]);
						
						if (ntext != undefined && ntext.length > opts.chars) {
							c = nodes[j];
							break;
						}
						
						j--;
						
					}
					
					t.style[opts.method] = '0';
					
					var ctext = wt.text( c );
				
					if (c) wt.tamer(c, t, ctext, 0, opts);
				
				}
				
				i++;
			
			}
			
			wt.bind(opts.event, function () { wt.onevent(opts); });
		
		}
	
	},
	
	text : function (t) {
		
		return t.innerText || t.textContent;
		
	},
	
	settext : function (e, t) {
	
		if (e.innerText) e.innerText = t;
		else e.textContent = t; 
	
	},

	tamer : function (c, t, text, i, opts) {
		
		var h = t.offsetHeight;
		
		wt.settext(c, text.slice(0, (opts.chars * -1)));
		
		if (t.offsetHeight < h) {
		
			if (opts.method == 'nbsp') wt.settext(c, wt.text( c ) + text.slice((opts.chars * -1)).replace(/\s/g, '\u00a0'));
			
			else {
					
				var inc = (opts.method.match('padding')) ? (i / 10) : (i / 100);
				
				if (opts.dir == 'neg') inc = inc * -1; 
				
				t.style[opts.method] = inc + 'em';
				
				wt.settext(c, text);
				
				wt.tamer(c, t, text, i + 1, opts);
				
			}
		
		}
		else wt.settext(c, text);
		
	},
	
	onevent : function (opts) {
		
		var to = "'" + opts.elements.replace(/[^a-zA-Z0-9\-\.]/g, '') + "'";
		
		clearTimeout(wt.to[to]);
		wt.to[to] = setTimeout(function () { wt.hunter(opts); }, 250);
	
	},
	
	bind : function (e, f) {
		
		if (window.attachEvent) window.attachEvent('on' + e, f );
		else window.addEventListener(e, f, true);
	
	},
	
	fixmethod : function (s) {
	
		return s.replace(/-([a-zA-Z])/, function (m) {
			
			return m.replace('-','').toUpperCase();
			
		});
		
	},
	
	getstyle : function (t, s, n) {
		
		var r;
		
		if (t.currentStyle) r = t.currentStyle[s.replace(/-([A-z])/gi, function(a,b) {return b.toUpperCase();})];
		else if (window.getComputedStyle) r = document.defaultView.getComputedStyle(t,null).getPropertyValue(s);
		
		if (n) return parseFloat(r);
		else return r;
		
	}
	
};