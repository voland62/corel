var canvas1 = document.createElement('canvas');
var context1 = canvas1.getContext('2d');
canvas1.width = 860
canvas1.height = 860
context1.setTransform(1.6757812500000002,0,0,1.6757812500000002,1,1);
context1.beginPath();
context1.moveTo(0,0);
context1.lineTo(511.9999999999999,0);
context1.lineTo(511.9999999999999,511.9999999999999);
context1.lineTo(0,511.9999999999999);
context1.lineTo(0,0);
context1.closePath();
context1.setTransform(857.9999999999999,0,0,858.0000000000003,1,1);
var pattern1_0 = context1.createRadialGradient(0.5, 0.5, 0, 0.5, 0.5, 0.5);
pattern1_0.addColorStop(0,"#EBEBEB");
pattern1_0.addColorStop(1,"#000000");
context1.fillStyle = pattern1_0;
context1.globalAlpha = 1;
context1.fill("nonzero");
context1.setTransform(1.6757812500000002,0,0,1.6757812500000002,1,1);
var canvas2 = document.createElement('canvas');
document.body.appendChild(canvas2);
canvas2.width = 860;
canvas2.height = 860;
var gl = canvas2.getContext('webgl', {"premultipliedAlpha":false});
gl.getExtension('OES_texture_float');
gl.getExtension('OES_texture_float_linear');
var pattern2_1 = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(pattern2_1,
`attribute vec2 vertex;
attribute vec2 _texCoord;
varying highp vec2 texCoord;
varying vec2 localTexCoord;
uniform vec2 tileSize;
uniform vec2 offset;
uniform vec2 texSize;
void main() {
	localTexCoord = _texCoord;
	texCoord = (localTexCoord * tileSize + offset)/texSize;
	gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);
}
`);
gl.compileShader(pattern2_1);
gl.getShaderParameter(pattern2_1,gl.COMPILE_STATUS);
var pattern2_2 = gl.createProgram();
gl.attachShader(pattern2_2,pattern2_1);
var pattern2_3 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(pattern2_3,
`
precision highp float;
uniform highp sampler2D texture;
uniform vec2 center;
uniform float scale;
uniform vec2 texSize;
uniform vec2 tileSize;
uniform vec2 offset;

uniform float smooThreshold;

varying highp vec2 texCoord;

const vec3 WHITE = vec3(1);
const vec3 RED = vec3(178, 34, 52)/ 256.;
const vec3 BLUE = vec3(60, 59, 110)/ 256.;
const vec3 LBLUE = vec3(5, 180, 255) / 256.;
const float PI = 3.1415;

float circ(vec2 _p, vec2 c, in float r){
    vec2 p = _p - c;
    return step(dot(p,p),r * r);
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}


vec2 toLocal(vec2 coord) {
	return ((coord * texSize) - offset)/tileSize;
}

// barycentric
vec3 bary(vec2 p){
	return vec3(p, 1.0 - p.x - p.y);
}

vec2 smoother (vec2 a, vec2 b, float alen, float blen) {
	float d = smooThreshold;
	return  a + smoothstep(0.5 - d, 0.5 + d, alen / (alen + blen)) * (b - a);
}



vec4 corelLogo(vec2 p){
	p -= vec2(0.7, 0.5);
    p *= 1.2;

    vec2 z = p;
    z.y -= abs(z.x) * .6;
    z.x = abs(z.x);

    z.x /= .7 * sin( 3.1* z.y + PI *.5);
    

    float r = sdBox(z , vec2(.2, .5));
    r = step(r, 0.);

    float r2 = sdBox(z - vec2(0.4, 0.0) , vec2(.06, .5));
    r2 = step(r2, 0. );

    r += r2;

    float r3 = sdBox(z - vec2(0.55, 0.0) , vec2(.025, .5));
    r3 = step( r3, 0. );

    r += r3;

    r *= step(-0.43, p.y);

    vec3 col =  mix(vec3(0), RED, r);
    
    vec3 bg = LBLUE;
    bg = mix(bg, vec3(0, .6, 0), 0.9 * circ(p, vec2(0.1, -0.2), .6));
    bg = mix(bg, vec3(0, .9, 0), 0.9 * circ(p, vec2(-0.15, -0.44), .6));
    bg = mix(bg, vec3(1, 1, 0), 0.75 * circ(p, vec2(0.2, -0.3), .37));
    bg = mix(bg, vec3(1, .01, .01),  .8 * circ(p, vec2(-0.4, -0.45), .5));

    //col = bg ;//* r;
    col = mix(col, bg, r);


    // basket
    vec2 b = p + vec2(0,.54);
    b.x = abs(b.x);
    b.y *= 1.2;

    b.x += -b.y * .25;

    b *= 14.;

    float basket = sdBox(b - vec2(0.0) , vec2(1));
    basket = step(basket, 0. );
    
    col = mix(col, vec3(0, 0, 1), basket);

    return vec4(col, clamp(r + basket, 0., 1.));

}



void main() {
	vec2 t = (texCoord * texSize - center) / scale;
	vec2 tex = t;
	tex.y /= 0.866025404;
	tex.x -= tex.y * 0.5;
	
	vec2 a;
	// if (tex.x + tex.y - floor(tex.x) - floor(tex.y) < 1.0)
	vec2 fractTex = fract(tex);
	
	//vec2 p = fract(tex + vec2(.9));
	
	if (fractTex.x + fractTex.y < 1.0)	
		// a = vec2(floor(tex.x), floor(tex.y));
		a = floor(tex);
	else
		//a = vec2(ceil(tex.x), ceil(tex.y));
		a = ceil(tex);

	vec2 b = vec2(ceil(tex.x), floor(tex.y));
	vec2 c = vec2(floor(tex.x), ceil(tex.y));

  	//vec2 d = vec2(floor(0.5+tex.x), floor(0.5+tex.y)); // not used!
  	//vec2 d = floor(tex + vec2(0.5));

	//vec3 TEX = vec3(tex.x, tex.y, 1.0 - tex.x - tex.y);
	vec3 TEX = bary(tex);	
	vec3 A = bary(a);
	vec3 B = bary(b);
	vec3 C = bary(c);
	float alen = length(TEX - A);
	float blen = length(TEX - B);
	float clen = length(TEX - C);

	vec2 choice;

	if (alen >= blen && alen >= clen){
		choice = smoother(b, c, blen, clen);
	}

	if (blen >= alen && blen >= clen){
		choice = smoother(a, c, alen , clen);		
	}
	if (clen >= alen && clen >= blen){
		choice = smoother(a, b, alen, blen);
	}

	choice.x += choice.y * 0.5;
	choice.y *= 0.866025404;
	choice *= scale / texSize;

	vec4 col = texture2D(texture, toLocal(choice + center / texSize));

	vec2 d = vec2(.35, .45);
	vec2 p = fract(-tex + d);
	
	p.x += p.y * 0.5;	
	
	p *= 1.2;
	
	vec4 logo = corelLogo(p);
	col = mix(col, vec4(logo.rgb, 1), logo.a);

	gl_FragColor =  col;
}
`);
gl.compileShader(pattern2_3);
gl.getShaderParameter(pattern2_3,gl.COMPILE_STATUS);
gl.attachShader(pattern2_2,pattern2_3);
gl.linkProgram(pattern2_2);
gl.getProgramParameter(pattern2_2,gl.LINK_STATUS);
gl.clearColor(0,0,0,0);
gl.clear(gl.COLOR_BUFFER_BIT);
var pattern2_4 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,pattern2_4);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
gl.bindTexture(gl.TEXTURE_2D,pattern2_4);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,canvas1);
var pattern2_5 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,pattern2_5);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,860,860,0,gl.RGBA,gl.FLOAT,null);
var pattern2_6 = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,pattern2_6);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,860,860,0,gl.RGBA,gl.FLOAT,null);
var pattern2_8 = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(pattern2_8,
`attribute vec2 vertex;
attribute vec2 _texCoord;
varying highp vec2 texCoord;
void main() {
	texCoord = _texCoord;
	gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);
}`);
gl.compileShader(pattern2_8);
gl.getShaderParameter(pattern2_8,gl.COMPILE_STATUS);
var pattern2_9 = gl.createProgram();
gl.attachShader(pattern2_9,pattern2_8);
var pattern2_10 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(pattern2_10,
`precision highp float;
uniform highp sampler2D texture;
varying highp vec2 texCoord;
void main() {
	gl_FragColor = texture2D(texture, vec2(texCoord.x, 1.0 - texCoord.y));
}`);
gl.compileShader(pattern2_10);
gl.getShaderParameter(pattern2_10,gl.COMPILE_STATUS);
gl.attachShader(pattern2_9,pattern2_10);
gl.linkProgram(pattern2_9);
gl.getProgramParameter(pattern2_9,gl.LINK_STATUS);
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D,pattern2_4);
var pattern2_11 = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER,pattern2_11);
gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,pattern2_5,0);
gl.viewport(0,0,860,860);
var pattern2_12 = gl.createProgram();
gl.attachShader(pattern2_12,pattern2_8);
var pattern2_13 = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(pattern2_13,
`precision highp float;
uniform highp sampler2D texture;
varying highp vec2 texCoord;
void main() {
	gl_FragColor = texture2D(texture, texCoord);
}`);
gl.compileShader(pattern2_13);
gl.getShaderParameter(pattern2_13,gl.COMPILE_STATUS);
gl.attachShader(pattern2_12,pattern2_13);
gl.linkProgram(pattern2_12);
gl.getProgramParameter(pattern2_12,gl.LINK_STATUS);
var pattern2_14 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,pattern2_14);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,1]),gl.STATIC_DRAW);
var pattern2_15 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,pattern2_15);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,1]),gl.STATIC_DRAW);
var pattern2_16 = gl.getAttribLocation(pattern2_12,"vertex");
gl.enableVertexAttribArray(pattern2_16);
var pattern2_17 = gl.getAttribLocation(pattern2_12,"_texCoord");
gl.enableVertexAttribArray(pattern2_17);



function draw (smooth){
	gl.useProgram(pattern2_12);
	gl.bindBuffer(gl.ARRAY_BUFFER,pattern2_14);
	gl.vertexAttribPointer(pattern2_16,gl.LINE_LOOP,gl.FLOAT,false,0,0);
	gl.bindBuffer(gl.ARRAY_BUFFER,pattern2_15);
	gl.vertexAttribPointer(pattern2_17,gl.LINE_LOOP,gl.FLOAT,false,0,0);
	gl.drawArrays(gl.TRIANGLE_STRIP,0,gl.TRIANGLES);
	gl.bindFramebuffer(gl.FRAMEBUFFER,null);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,pattern2_5);
	gl.bindFramebuffer(gl.FRAMEBUFFER,pattern2_11);
	gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,pattern2_6,0);
	gl.viewport(0,0,860,860);

	gl.useProgram(pattern2_2);
	var pattern2_18 = gl.getUniformLocation(pattern2_2,"center");
	gl.uniform2fv(pattern2_18,new Float32Array([430,430]));
	var pattern2_19 = gl.getUniformLocation(pattern2_2,"scale");
	gl.uniform1f(pattern2_19,75.68);

	var pattern2_100 = gl.getUniformLocation(pattern2_2,"smooThreshold");
	gl.uniform1f(pattern2_100, smooth);

	var pattern2_20 = gl.getUniformLocation(pattern2_2,"texSize");
	gl.uniform2fv(pattern2_20,new Float32Array([860,860]));
	var pattern2_21 = gl.getUniformLocation(pattern2_2,"tileSize");
	gl.uniform2fv(pattern2_21,new Float32Array([860,860]));
	var pattern2_22 = gl.getUniformLocation(pattern2_2,"offset");
	gl.uniform2fv(pattern2_22,new Float32Array([0,0]));
	gl.bindBuffer(gl.ARRAY_BUFFER,pattern2_14);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,1]),gl.STATIC_DRAW);
	var pattern2_23 = gl.getAttribLocation(pattern2_2,"vertex");
	gl.enableVertexAttribArray(pattern2_23);
	var pattern2_24 = gl.getAttribLocation(pattern2_2,"_texCoord");
	gl.enableVertexAttribArray(pattern2_24);


	gl.bindBuffer(gl.ARRAY_BUFFER,pattern2_14);
	gl.vertexAttribPointer(pattern2_23,gl.LINE_LOOP,gl.FLOAT,false,0,0);
	gl.bindBuffer(gl.ARRAY_BUFFER,pattern2_15);
	gl.vertexAttribPointer(pattern2_24,gl.LINE_LOOP,gl.FLOAT,false,0,0);
	gl.drawArrays(gl.TRIANGLE_STRIP,0,gl.TRIANGLES);
	gl.bindFramebuffer(gl.FRAMEBUFFER,null);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,pattern2_6);
	gl.bindBuffer(gl.ARRAY_BUFFER,pattern2_14);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,0,1,1]),gl.STATIC_DRAW);
	var pattern2_25 = gl.getAttribLocation(pattern2_9,"vertex");
	gl.enableVertexAttribArray(pattern2_25);
	var pattern2_26 = gl.getAttribLocation(pattern2_9,"_texCoord");
	gl.enableVertexAttribArray(pattern2_26);
	gl.useProgram(pattern2_9);
	gl.bindBuffer(gl.ARRAY_BUFFER,pattern2_14);
	gl.vertexAttribPointer(pattern2_25,gl.LINE_LOOP,gl.FLOAT,false,0,0);
	gl.bindBuffer(gl.ARRAY_BUFFER,pattern2_15);
	gl.vertexAttribPointer(pattern2_26,gl.LINE_LOOP,gl.FLOAT,false,0,0);
	gl.drawArrays(gl.TRIANGLE_STRIP,0,gl.TRIANGLES);
	gl.deleteTexture(pattern2_4);
}

draw(0.01);

const smoother = document.querySelector('.smoother');
if (smoother) {
	
	smoother.addEventListener('input', (e) => {
		//console.log(e.target.value);
		//gl.uniform1f(pattern2_100, 0.1);
		//////gl.uniform1f(pattern2_100, e.target.value);

		draw(e.target.value);

	});
}

