// Vietnamese lunar calendar, after Ho Ngoc Duc's published astronomical algorithm (timezone UTC+7).
const Lunar=(()=>{const F=Math.floor,PI=Math.PI,TZ=7;
function jd(d,m,y){const a=F((14-m)/12),yy=y+4800-a,mm=m+12*a-3;let j=d+F((153*mm+2)/5)+365*yy+F(yy/4)-F(yy/100)+F(yy/400)-32045;if(j<2299161)j=d+F((153*mm+2)/5)+365*yy+F(yy/4)-32083;return j}
function nm(k){const T=k/1236.85,T2=T*T,T3=T2*T,dr=PI/180;let J=2415020.75933+29.53058868*k+0.0001178*T2-0.000000155*T3;J+=0.00033*Math.sin((166.56+132.87*T-0.009173*T2)*dr);
const M=359.2242+29.10535608*k-0.0000333*T2-0.00000347*T3,Mp=306.0253+385.81691806*k+0.0107306*T2+0.00001236*T3,Fv=21.2964+390.67050646*k-0.0016528*T2-0.00000239*T3;
let C=(0.1734-0.000393*T)*Math.sin(M*dr)+0.0021*Math.sin(2*dr*M)-0.4068*Math.sin(Mp*dr)+0.0161*Math.sin(dr*2*Mp)-0.0004*Math.sin(dr*3*Mp)+0.0104*Math.sin(dr*2*Fv)-0.0051*Math.sin(dr*(M+Mp))-0.0074*Math.sin(dr*(M-Mp))+0.0004*Math.sin(dr*(2*Fv+M))-0.0004*Math.sin(dr*(2*Fv-M))-0.0006*Math.sin(dr*(2*Fv+Mp))+0.0010*Math.sin(dr*(2*Fv-Mp))+0.0005*Math.sin(dr*(2*Mp+M));
const dt=T<-11?0.001+0.000839*T+0.0002261*T2-0.00000845*T3-0.000000081*T*T3:-0.000278+0.000265*T+0.000262*T2;return J+C-dt}
const NM=k=>F(nm(k)+0.5+TZ/24);
function sl(j){const T=(j-2451545.0)/36525,T2=T*T,dr=PI/180,M=357.52910+35999.05030*T-0.0001559*T2-0.00000048*T*T2,L0=280.46645+36000.76983*T+0.0003032*T2;
let DL=(1.914600-0.004817*T-0.000014*T2)*Math.sin(dr*M)+(0.019993-0.000101*T)*Math.sin(dr*2*M)+0.000290*Math.sin(dr*3*M);let L=(L0+DL)*dr;L-=PI*2*F(L/(PI*2));return F(L/PI*6)}
const SL=d=>sl(d-0.5-TZ/24);
function m11(y){const off=jd(31,12,y)-2415021,k=F(off/29.530588853);let n=NM(k);if(SL(n)>=9)n=NM(k-1);return n}
function leapOff(a){const k=F((a-2415021.076998695)/29.530588853+0.5);let last,i=1,arc=SL(NM(k+i));do{last=arc;i++;arc=SL(NM(k+i))}while(arc!=last&&i<14);return i-1}
function conv(d,m,y){const dn=jd(d,m,y),k=F((dn-2415021.076998695)/29.530588853);let ms=NM(k+1);if(ms>dn)ms=NM(k);let a=m11(y),b=a,ly;if(a>=ms){ly=y;a=m11(y-1)}else{ly=y+1;b=m11(y+1)}
const ld=dn-ms+1,diff=F((ms-a)/29);let leap=0,lm=diff+11;if(b-a>365){const lo=leapOff(a);if(diff>=lo){lm=diff+10;if(diff==lo)leap=1}}if(lm>12)lm-=12;if(lm>=11&&diff<4)ly-=1;return{d:ld,m:lm,y:ly,leap}}
return{conv}})();
