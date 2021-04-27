import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';


// ページの読み込みを待つ
window.addEventListener('load', confirm);
function confirm(){
    var result = window.confirm('複数の画像ダウンロードが発生します。');
    if(result == true){
        init();
    }
}
function init() {
    // サイズを指定
    const width = 200;
    const height = 200;
    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
    antialias: true
    });
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    // シーンを作成
    const scene = new THREE.Scene();
    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(0, 0, 500);


    const mesh = new Donuts(3.8, 0xF42303);
    scene.add(mesh);

    const mesh2 = new Donuts(4, 0xA1F104);
    scene.add(mesh2);

    const mesh3 = new Donuts(4.1, 0xFEAC06);
    scene.add(mesh3);

    const mesh4 = new Donuts(4.2, 0x0470FD);
    scene.add(mesh4);
    render();

    // 毎フレーム時に実行されるループイベントです
    function render() {
    // 更新命令を実行します。
    mesh.update();
    mesh2.update();
    mesh3.update();
    mesh4.update();
    // レンダリング
    renderer.render(scene, camera);
    //requestAnimationFrame(render);
    }


    //=====================================//
    //連番画像書き出し
    //=====================================//

    const array = []
    let i = 0
    let flames = 1000; //フレーム数
    let times = 100; //~ミリ秒に一回描画
    const recorder = setInterval(() => {
      if (i < flames) {
        render();
        //canvasのDOMを取得
        document.querySelector('#myCanvas').toBlob(blob => {
          array.push(window.URL.createObjectURL(blob));//取得したurlを配列に格納
        },0.8)//末尾画質指定
        i ++;
      } else {
        console.log(array);
        clearInterval(recorder);
        exportFunc();//書き出し
      }
    }, times);
    
    //空のaタグを作成
    const a = document.createElement("a");
    a.style = "display: none";
    document.body.appendChild(a);
    
    //ダウンロード
    const exportFunc = async () => {
      let i = 0    
      for (const url of array) {
        console.log(i);
        a.href = url;
        a.download = "#" + zeroPadding(i, 5) + ".jpg";
        a.click();
        i ++;      　
        await new Promise(r => setTimeout(r, 100)); 
      }
    };    
    //=====================================//
    //=====================================//
    

}

/** メッシュを継承した独自グループのクラスです。 */
class Donuts extends THREE.Object3D {
    /** コンストラクターです。 */
    constructor(radius,color) {
    super();

    this.array = [];

    for(var i = 0; i < 100; i++) {
        this.mesh = new THREE.Mesh(
        new THREE.TorusBufferGeometry( radius*i, 0.4, 2, 100 ),
        new THREE.MeshBasicMaterial( { color: color } )
        );
        this.mesh.rotation.x = i*0.02;
        this.mesh.rotation.y = i*0.02;
        this.mesh.rotation.z = i*0.02;
        this.array[i] = this.mesh;
        this.add(this.mesh);
    }

    }
    /** 更新命令を定義します。 */
    update() {
        for(var i = 0; i < this.array.length; i++) {
            // X軸に動かす
            this.array[i].rotation.x += 0.01;
            this.array[i].rotation.y += 0.01;
            this.array[i].rotation.z += 0.01;
        }
    }
}

function zeroPadding(NUM, LEN){
	return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}