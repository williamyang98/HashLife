(this.webpackJsonphashlife=this.webpackJsonphashlife||[]).push([[0],{25:function(e,t,i){e.exports=i(30)},30:function(e,t,i){"use strict";i.r(t);var n=i(2),r=i.n(n),s=i(13),a=i.n(s),o=i(10),u=i(11),h=i(3),c=i(4),l=i(7),v=i(6),f=i(15),_=i(0),d=i(1),p=function(){function e(t,i,n){Object(_.a)(this,e),this.gl=t,this.create_shader_program(i,n),this.uniforms=[],this.locations=[]}return Object(d.a)(e,[{key:"create_shader_program",value:function(e,t){var i=function(e,t,i){var n=e.createShader(e.VERTEX_SHADER);if(e.shaderSource(n,t),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS))throw console.error(e.getShaderInfoLog(n)),console.error(g(t)),new Error("Unable to compile vertex shader");var r=e.createShader(e.FRAGMENT_SHADER);if(e.shaderSource(r,i),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw console.error(e.getShaderInfoLog(r)),new Error("Unable to compile fragment shader");var s=e.createProgram();if(e.attachShader(s,n),e.attachShader(s,r),e.linkProgram(s),!e.getProgramParameter(s,e.LINK_STATUS))throw console.error(e.getProgramInfoLog(s)),console.error(g(i)),new Error("Unable to construct shader program");return[n,r,s]}(this.gl,e,t),n=Object(f.a)(i,3);this.vertex_shader=n[0],this.fragment_shader=n[1],this.program=n[2]}},{key:"add_uniform",value:function(e,t){var i=this.gl.getUniformLocation(this.program,e);this.uniforms.push(t),this.locations.push(i)}},{key:"bind",value:function(){this.gl.useProgram(this.program);for(var e=0;e<this.uniforms.length;e++){var t=this.uniforms[e],i=this.locations[e];null!==i&&t.apply(i)}}}]),e}();function g(e){return e.split("\n").map((function(e,t){return"".concat(t+1,"\t| ").concat(e)})).join("\n")}var b=i(14),m=function(){function e(t,i,n){Object(_.a)(this,e),this.gl=t,this.data=i,this.vbo=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.vbo),t.bufferData(t.ARRAY_BUFFER,i,n)}return Object(d.a)(e,[{key:"bind",value:function(){var e=this.gl;e.bindBuffer(e.ARRAY_BUFFER,this.vbo)}}]),e}(),w=function(){function e(t){Object(_.a)(this,e),this.gl=t,this.vao=t.createVertexArray(),this.integer_types=new Set([t.INT,t.UNSIGNED_INT])}return Object(d.a)(e,[{key:"add_vertex_buffer",value:function(e,t){var i=this.gl;this.bind(),e.bind();var n,r=0,s=Object(b.a)(t.attributes);try{for(s.s();!(n=s.n()).done;){var a=n.value;i.enableVertexAttribArray(a.index),this.integer_types.has(a.type)?i.vertexAttribIPointer(a.index,a.count,a.type,a.is_normalised,t.stride,r):i.vertexAttribPointer(a.index,a.count,a.type,a.is_normalised,t.stride,r),r+=a.count*a.size}}catch(o){s.e(o)}finally{s.f()}}},{key:"bind",value:function(){this.gl.bindVertexArray(this.vao)}}]),e}(),y=function(){function e(t){Object(_.a)(this,e),this.gl=t,this.stride=0,this.attributes=[]}return Object(d.a)(e,[{key:"push_attribute",value:function(e,t,i,n){var r=this.sizeof(i),s=new E(e,t,i,n,r);this.attributes.push(s),this.stride+=t*r}},{key:"slice",value:function(t,i){var n=new e;return n.stride=this.stride,n.attributes=this.attributes.slice(t,i),n}},{key:"sizeof",value:function(e){var t=this.gl;switch(e){case t.FLOAT:case t.UNSIGNED_INT:case t.INT:return 4;default:throw new Error("Unknown element type: ".concat(e))}}}]),e}(),E=function e(t,i,n,r,s){Object(_.a)(this,e),this.index=t,this.count=i,this.type=n,this.is_normalised=r,this.size=s},k=function(){function e(t){Object(_.a)(this,e),this.callback=t}return Object(d.a)(e,[{key:"apply",value:function(e){this.callback(e)}}]),e}(),T=function(){function e(t,i){Object(_.a)(this,e),this.gl=t,this.buffer=t.createBuffer(),this.count=i.length,t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.buffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,i,t.STATIC_DRAW)}return Object(d.a)(e,[{key:"bind",value:function(){var e=this.gl;e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.buffer)}}]),e}(),x="#version 300 es\nprecision mediump float;\n\nin vec2 position;\n\nout vec2 vPosition;\n\nvoid main() {\n    vPosition = vec2((position.x+1.0)/2.0, (-position.y+1.0)/2.0);\n    gl_Position = vec4(position.x, position.y, 0.0, 1.0);\n}",O="#version 300 es\nprecision mediump float;\nprecision highp sampler2D;\n\nin vec2 vPosition;\n\nout vec4 FragColour;\n\nuniform sampler2D uDataTexture;\n\nvoid main() {\n    vec4 cell = texture(uDataTexture, vPosition);\n    float state = 1.0-cell[0];\n    FragColour = vec4(state, state, state, 1.0);\n    // FragColour = vec4(vPosition.x, vPosition.y, 1.0, 1.0);\n}",R=i(16),j=function(){function e(t){Object(_.a)(this,e),this.gl=t,this.clear_colour=new Float32Array([1,1,1,1])}return Object(d.a)(e,[{key:"clear",value:function(){var e=this.gl;e.clearColor.apply(e,Object(R.a)(this.clear_colour)),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)}},{key:"draw",value:function(e,t,i){var n=this.gl;i.bind(),e.bind(),t.bind(),n.drawElements(n.TRIANGLES,t.count,n.UNSIGNED_INT,0)}}]),e}(),A=function(){function e(t,i,n){Object(_.a)(this,e),this.gl=t,this.data=i,this.shape=n,this.texture=t.createTexture(),this.bind(),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.R8,n[0],n[1],0,t.RED,t.UNSIGNED_BYTE,this.data)}return Object(d.a)(e,[{key:"bind",value:function(){var e=this.gl;e.bindTexture(e.TEXTURE_2D,this.texture)}},{key:"active",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=this.gl;this.bind(),t.activeTexture(t.TEXTURE0+e)}}]),e}(),U=function(){function e(t){Object(_.a)(this,e),this.gl=t,this.fb=t.createFramebuffer()}return Object(d.a)(e,[{key:"attach_texture2D",value:function(e){var t=this.gl,i=e.texture;this.bind(),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,i,0),this.unbind()}},{key:"bind",value:function(){var e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,this.fb)}},{key:"unbind",value:function(){var e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null)}}]),e}(),D=function(){function e(t,i,n){Object(_.a)(this,e),this.gl=t,this.shape=n,this.data=i,this.count=n[0]*n[1],this.data_texture=new A(t,this.data,this.shape),this.frame_buffer=new U(t),this.frame_buffer.attach_texture2D(this.data_texture)}return Object(d.a)(e,[{key:"refresh",value:function(){var e=this.gl;e.texSubImage2D(e.TEXTURE_2D,0,0,0,this.shape[0],this.shape[1],e.RED,e.UNSIGNED_BYTE,this.data)}},{key:"bind",value:function(){this.data_texture.active(0)}}]),e}(),F=function(e){Object(l.a)(i,e);var t=Object(v.a)(i);function i(e,n,r,s){var a,o=arguments.length>4&&void 0!==arguments[4]&&arguments[4];return Object(h.a)(this,i),(a=t.call(this,e,n,r,s)).result=null,a.time_compression=o,a}return Object(c.a)(i,[{key:"create",value:function(e,t,n,r){var s=arguments.length>4&&void 0!==arguments[4]&&arguments[4];return new i(e,t,n,r,s)}},{key:"create_horizontal",value:function(e,t){return this.create(e.ne,t.nw,e.se,t.sw)}},{key:"create_vertical",value:function(e,t){return this.create(e.sw,e.se,t.nw,t.ne)}},{key:"create_center",value:function(){return this.create(this.nw.se,this.ne.sw,this.sw.ne,this.se.nw)}},{key:"get_next_generation",value:function(){if(null!==this.result)return this.result;if(0===this.population)return this.result=this.nw,this.result;if(2===this.level)return this.result=this.slow_simulation(),this.result;var e=this.nw,t=this.create_horizontal(this.nw,this.ne),i=this.ne,n=this.create_vertical(this.nw,this.sw),r=this.create_center(),s=this.create_vertical(this.ne,this.se),a=this.sw,o=this.create_horizontal(this.sw,this.se),u=this.se;this.time_compression?(e=e.get_next_generation(),t=t.get_next_generation(),i=i.get_next_generation(),n=n.get_next_generation(),r=r.get_next_generation(),s=s.get_next_generation(),a=a.get_next_generation(),o=o.get_next_generation(),u=u.get_next_generation()):(e=e.create_center(),t=t.create_center(),i=i.create_center(),n=n.create_center(),r=r.create_center(),s=s.create_center(),a=a.create_center(),o=o.create_center(),u=u.create_center());var h=this.create(e,t,n,r).get_next_generation(),c=this.create(t,i,r,s).get_next_generation(),l=this.create(n,r,a,o).get_next_generation(),v=this.create(r,s,o,u).get_next_generation();return this.result=this.create(h,c,l,v),this.result}},{key:"slow_simulation",value:function(){for(var e=0,t=0;t<4;t++)for(var i=0;i<4;i++)e|=this.get(t,i)<<t+4*i;var n=this.create(this.one_generation(e>>0)),r=this.create(this.one_generation(e>>1)),s=this.create(this.one_generation(e>>4)),a=this.create(this.one_generation(e>>5));return this.create(n,r,s,a)}},{key:"one_generation",value:function(e){if(0===e)return 0;var t=e>>5&1;e&=1879;for(var i=0;0!==e;)i++,e&=e-1;return 3===i||2===i&&0!==t?1:0}}]),i}(function(){function e(t,i,n,r){if(Object(h.a)(this,e),void 0===i)return this.population=t,void(this.level=0);this.nw=t,this.ne=i,this.sw=n,this.se=r,this.level=this.nw.level+1,this.population=t.population+i.population+n.population+r.population}return Object(c.a)(e,[{key:"create",value:function(e,t,i,n){throw new Error("Shouldn't use this factory method for node creation")}},{key:"create_tree",value:function(e,t){if(0===t)return this.create(e);var i=this.create_tree(e,t-1);return this.create(i,i,i,i)}},{key:"set",value:function(e,t,i){if(0===this.level)return this.create(i);var n=1<<this.level-1,r=[this.nw,this.ne,this.sw,this.se],s=r[0],a=r[1],o=r[2],u=r[3];return e>=n?t<n?s=this.nw.set(e-n,t,i):o=this.sw.set(e-n,t-n,i):t<n?a=this.ne.set(e,t,i):u=this.se.set(e,t-n,i),this.create(s,a,o,u)}},{key:"get",value:function(e,t){if(0===this.level)return this.population;var i=1<<this.level-1;return e>=i?t<i?this.ne.get(e-i,t):this.se.get(e-i,t-i):t<i?this.nw.get(e,t):this.sw.get(e,t-i)}},{key:"expand",value:function(){var e=this.create_tree(0,this.level-1),t=this.create(e,e,e,this.nw),i=this.create(e,e,this.ne,e),n=this.create(e,this.sw,e,e),r=this.create(this.se,e,e,e);return this.create(t,i,n,r)}}],[{key:"bootstrap",value:function(t,i){return new e(0).create_tree(t,i)}}]),e}());var S=function(){function e(){Object(h.a)(this,e),this.map={},this.hits=0,this.misses=0,this.count=0,console.log(this)}return Object(c.a)(e,[{key:"clear",value:function(){this.map={}}},{key:"put",value:function(e,t,i,n,r,s){var a=this.map[e];if(void 0===a){var u=new I(t,i,n,r,s);return this.map[e]=[u],this.misses+=1,this.count+=1,u}var h,c=Object(o.a)(a);try{for(c.s();!(h=c.n()).done;){var l=h.value;if(l.equals(t,i,n,r,s))return this.hits+=1,l}}catch(f){c.e(f)}finally{c.f()}this.misses+=1,this.count+=1;var v=new I(t,i,n,r,s);return a.push(v),v}}]),e}(),I=function(e){Object(l.a)(i,e);var t=Object(v.a)(i);function i(e,n,r,s){var a,o=arguments.length>4&&void 0!==arguments[4]&&arguments[4];return Object(h.a)(this,i),(a=t.call(this,e,n,r,s,o)).address=i.generate_id(),a}return Object(c.a)(i,[{key:"equals",value:function(e,t,i,n,r){if(void 0===t){var s=e;return 0===this.level&&this.population===s}return e.level===this.level-1&&(e===this.nw&&t===this.ne&&i===this.sw&&n===this.se)}},{key:"create",value:function(e,t,n,r){return i.put_default_node(e,t,n,r,this.time_compression)}},{key:"create_tree",value:function(e,t){if(0===t)return this.create(e,void 0,void 0,void 0);var i=this.create_tree(e,t-1);return this.create(i,i,i,i)}}],[{key:"hash_code",value:function(e,t,i,n,r){return void 0===t?e:e.address+11*t.address+101*i.address+1007*n.address}},{key:"generate_id",value:function(){var e=i.CurrentID;return i.CurrentID+=7,e}},{key:"put_default_node",value:function(e,t,n,r,s){var a=i.hash_code(e,t,n,r,s);return i.HashedNodes.put(a,e,t,n,r,s)}},{key:"bootstrap",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return new i(0,void 0,void 0,void 0,n).create_tree(e,t)}}]),i}(F);I.HashedNodes=new S,I.CurrentID=101;var N=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:3,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];Object(h.a)(this,e),this.time_compression=i,this.root=I.bootstrap(0,t,this.time_compression),this.construct_buffer()}return Object(c.a)(e,[{key:"construct_buffer",value:function(){this.shape=[1024,1024],this.count=this.shape[0]*this.shape[1],this.buffer=new Uint8Array(this.count)}},{key:"randomise",value:function(e,t,i,n){void 0===e&&(e=0,i=0,t=1<<this.root.level,n=1<<this.root.level);var r=this.randomise_recursive(this.root,e,t,i,n);r!==this.root&&this.update_buffer(r),this.root=r}},{key:"clear",value:function(e,t,i,n){void 0===e&&(e=0,i=0,t=1<<this.root.level,n=1<<this.root.level);var r=this.fill_recursive(this.root,0,e,t,i,n);r!==this.root&&this.update_buffer(r),this.root=r}},{key:"fill_recursive",value:function(e,t,i,n,r,s){var a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0,o=arguments.length>7&&void 0!==arguments[7]?arguments[7]:0,u=1<<e.level-1,h=1<<e.level;if(i>=h||r>=h||n<0||s<0)return e;if(0===e.level)return e.create(t);var c=this.fill_recursive(e.nw,t,i,P(n,u-1),r,P(s,u-1),a,o),l=this.fill_recursive(e.ne,t,M(0,i-u),n-u,r,P(s,u-1),a+u,o),v=this.fill_recursive(e.sw,t,i,P(n,u-1),M(0,r-u),s-u,a,o+u),f=this.fill_recursive(e.se,t,M(0,i-u),n-u,M(0,r-u),s-u,a+u,o+u),_=e.create(c,l,v,f);return _}},{key:"randomise_recursive",value:function(e,t,i,n,r){var s=arguments.length>5&&void 0!==arguments[5]?arguments[5]:0,a=arguments.length>6&&void 0!==arguments[6]?arguments[6]:0,o=1<<e.level-1,u=1<<e.level;if(t>=u||n>=u||i<0||r<0)return e;if(0===e.level){var h=Math.random()>.5?1:0;return e.create(h)}var c=this.randomise_recursive(e.nw,t,P(i,o-1),n,P(r,o-1),s,a),l=this.randomise_recursive(e.ne,M(0,t-o),i-o,n,P(r,o-1),s+o,a),v=this.randomise_recursive(e.sw,t,P(i,o-1),M(0,n-o),r-o,s,a+o),f=this.randomise_recursive(e.se,M(0,t-o),i-o,M(0,n-o),r-o,s+o,a+o),_=e.create(c,l,v,f);return _}},{key:"step",value:function(){var e=void 0;e=this.root.level>=8?this.wrapped_step(this.root):this.expanding_step(this.root),this.root!==e&&this.update_buffer(e),this.root=e}},{key:"expanding_step",value:function(e){for(;;){var t=[e.nw,e.ne,e.sw,e.se],i=t[0],n=t[1],r=t[2],s=t[3];if(!(e.level<3||i.population!==i.se.se.population||n.population!==n.sw.sw.population||r.population!==r.ne.ne.population||s.population!==s.nw.nw.population))break;e=e.expand()}return e.get_next_generation()}},{key:"wrapped_step",value:function(e){var t=e.get_next_generation(),i=e.create(e.ne,e.nw,e.se,e.sw).get_next_generation(),n=e.create(e.sw,e.se,e.nw,e.ne).get_next_generation(),r=e.create(e.se,e.sw,e.ne,e.nw).get_next_generation(),s=e.create(r.se,n.sw,i.ne,t.nw),a=e.create(n.se,r.sw,t.ne,i.nw),o=e.create(i.se,t.sw,r.ne,n.nw),u=e.create(t.se,i.sw,n.ne,r.nw);return e.create(s,a,o,u)}},{key:"update_buffer",value:function(e){this.draw_recursive(e,this.buffer,this.shape,0,this.shape[0],0,this.shape[1])}},{key:"draw_recursive",value:function(e,t,i,n,r,s,a){var o=arguments.length>7&&void 0!==arguments[7]?arguments[7]:0,u=arguments.length>8&&void 0!==arguments[8]?arguments[8]:0,h=1<<e.level-1,c=1<<e.level;if(!(n>=c||s>=c||r<0||a<0))if(0!==e.level)this.draw_recursive(e.nw,t,i,n,P(r,h-1),s,P(a,h-1),o,u),this.draw_recursive(e.ne,t,i,M(0,n-h),r-h,s,P(a,h-1),o+h,u),this.draw_recursive(e.sw,t,i,n,P(r,h-1),M(0,s-h),a-h,o,u+h),this.draw_recursive(e.se,t,i,M(0,n-h),r-h,M(0,s-h),a-h,o+h,u+h);else{var l=e.population>0?255:0;t[o+n+(u+s)*i[0]]=l}}}]),e}();function P(e,t){return e>=t?t:e}function M(e,t){return e>=t?e:t}var C={vertex_data:new Float32Array([-1,-1,-1,1,1,-1,1,1]),index_data:new Uint32Array([0,3,1,0,2,3])},B=function(){function e(t){Object(h.a)(this,e),this.gl=t,this.renderer=new j(t),this.shader=new p(t,x,O),this.shader.add_uniform("uDataTexture",new k((function(e){return t.uniform1i(e,0)}))),this.vbo=new m(t,C.vertex_data,t.STATIC_DRAW),this.ibo=new T(t,C.index_data);var i=new y(t);i.push_attribute(0,2,t.FLOAT,!1),this.vao=new w(t),this.vao.add_vertex_buffer(this.vbo,i),this.sim=new N(10,!0),this.grid=new D(t,this.sim.buffer,this.sim.shape),this.steps=0}return Object(c.a)(e,[{key:"run",value:function(){requestAnimationFrame(this.loop.bind(this))}},{key:"loop",value:function(){this.on_update(),this.on_render(),requestAnimationFrame(this.loop.bind(this))}},{key:"on_update",value:function(){this.running&&this.step(),this.steps>0&&(this.step(),this.steps-=1)}},{key:"step",value:function(){this.sim.step(),this.grid.refresh()}},{key:"clear",value:function(e,t,i,n){this.sim.clear(e,t,i,n),this.grid.refresh()}},{key:"randomise",value:function(e,t,i,n){this.sim.randomise(e,t,i,n),this.grid.refresh()}},{key:"on_render",value:function(){this.gl;this.shader.bind(),this.vao.bind(),this.ibo.bind(),this.grid.bind(),this.renderer.clear(),this.renderer.draw(this.vao,this.ibo,this.shader)}}]),e}(),L=i(9),X=function(e){Object(l.a)(i,e);var t=Object(v.a)(i);function i(e){var r;return Object(h.a)(this,i),(r=t.call(this,e)).ref=Object(n.createRef)(),r.state={failed_webgl:!1},r.controller=new G,r}return Object(c.a)(i,[{key:"componentDidMount",value:function(){var e=this,t=this.ref.current.getContext("webgl2");if(t){var i=new B(t);i.run(),this.is_randomise=!1,this.is_clear=!1,this.app=i,this.controller.listen_drag((function(t){var i=t.start,n=t.end,r=Math.min(i[0],n[0]),s=Math.max(i[0],n[0]),a=Math.min(i[1],n[1]),o=Math.max(i[1],n[1]);e.is_randomise?e.app.randomise(r,s,a,o):e.is_clear&&e.app.clear(r,s,a,o)}))}else this.setState(Object(u.a)(Object(u.a)({},this.state),{},{failed_webgl:!0}))}},{key:"step",value:function(){this.app.steps=1}},{key:"toggle",value:function(){this.app.running=!this.app.running}},{key:"on_mouse_down",value:function(e){switch(this.controller.on_mouse_down(e),e.button){case 0:this.is_randomise=!0;break;case 2:this.is_clear=!0}}},{key:"on_mouse_move",value:function(e){}},{key:"on_mouse_up",value:function(e){this.controller.on_mouse_up(e),this.is_randomise=!1,this.is_clear=!1,e.preventDefault()}},{key:"clear",value:function(e){this.app.clear()}},{key:"randomise",value:function(e){this.app.randomise()}},{key:"render",value:function(){var e=this;return this.state.failed_webgl?r.a.createElement("div",null,"Requires WebGL2 Support"):r.a.createElement("div",null,r.a.createElement("div",null,r.a.createElement("button",{onClick:function(t){return e.clear()}},"Clear"),r.a.createElement("button",{onClick:function(t){return e.step()}},"Step"),r.a.createElement("button",{onClick:function(t){return e.toggle()}},"Toggle"),r.a.createElement("button",{onClick:function(t){return e.randomise()}},"Randomise")),r.a.createElement("canvas",{width:1024,height:1024,ref:this.ref,onMouseDown:function(t){return e.on_mouse_down(t)},onMouseMove:function(t){return e.on_mouse_move(t)},onMouseUp:function(t){return e.on_mouse_up(t)}}))}}]),i}(r.a.Component),G=function(){function e(){Object(h.a)(this,e),this.drag_start=L.a.create(),this.drag_end=L.a.create(),this.drag_listeners=new Set}return Object(c.a)(e,[{key:"listen_drag",value:function(e){this.drag_listeners.add(e)}},{key:"on_mouse_down",value:function(e){this.drag_start=L.a.fromValues(e.clientX,e.clientY)}},{key:"on_mouse_up",value:function(e){this.drag_end=L.a.fromValues(e.clientX,e.clientY);var t,i=Object(o.a)(this.drag_listeners);try{for(i.s();!(t=i.n()).done;){(0,t.value)({start:this.drag_start,end:this.drag_end})}}catch(n){i.e(n)}finally{i.f()}}}]),e}();a.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(X,null)),document.getElementById("root"))}},[[25,1,2]]]);
//# sourceMappingURL=main.0a609e82.chunk.js.map