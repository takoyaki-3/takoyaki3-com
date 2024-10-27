import React from 'react';
import ContentDisplay from './ContentDisplay';

// Storybookの設定
export default {
  title: 'Components/ContentDisplay',
  component: ContentDisplay,
};

// ダミーデータ
const samplePage = {
  created: '2024-01-01',
  updated: '2024-01-05',
  tags: ['JavaScript', 'React', 'ストーリーブック'],
};

const sampleHTML = `
  <h1>サンプルコンテンツ</h1>
  <p>これは<strong>ContentDisplay</strong>コンポーネントのためのサンプルコンテンツです。</p>
  <p>このコンポーネントは、ReactとStorybookを使用してコンテンツを表示するために設計されています。</p>
  <h2>特徴</h2>
  <ul>
    <li>動的なタグの表示</li>
    <li>日付のフォーマット</li>
    <li>MarkdownまたはHTMLのサポート</li>
  </ul>
  <h2>テーブルの例</h2>
  <table>
    <thead>
      <tr><th style="padding: 12px; background-color: #00695c; color: white;">ヘッダー1</th><th>ヘッダー2</th></tr>
    </thead>
    <tbody>
      <tr><td style="padding: 12px;">行1, セル1</td><td>行1, セル2</td></tr>
      <tr><td>行2, セル1</td><td>行2, セル2</td></tr>
    </tbody>
  </table>
  <p>テーブルは自動的にスクロール可能なコンテナでラップされ、スマートフォンでも表示しやすくなっています。</p>
`;

export const Default = () => (
  <ContentDisplay page={samplePage} pageHTML={sampleHTML} />
);

const soleToTokyoPageMeta = {
  created: '2024-08-01',
  updated: '2024-08-02',
  tags: ['旅行', '鉄道', '船旅'],
};

const soleToTokyoPage = `
<h1>在来線と船だけで帰るソウルから東京旅</h1>
<p>夏休み後半戦に<strong>ソウルから東京まで、戦前からある在来線と船で行く</strong>をテーマに旅をしました。</p>
<h2>行程と交通費</h2>
<table>
<thead>
<tr>
<th>区間</th>
<th>列車・船</th>
<th>費用</th>
</tr>
</thead>
<tbody>
<tr>
<td>ソウル =&gt; 大邱</td>
<td>京釜線 ムグンファ号</td>
<td>20900ウォン（=2300円）</td>
</tr>
<tr>
<td>大邱 =&gt; 釜山</td>
<td>京釜線 ITX</td>
<td>11400ウォン（=1254円）</td>
</tr>
<tr>
<td>釜山 =&gt; 下関</td>
<td>釜関フェリー</td>
<td>6300円 + 21000ウォン（=2311円）※1</td>
</tr>
<tr>
<td>下関 =&gt; 岩国</td>
<td>山陽本線</td>
<td>青春18きっぷ ※2</td>
</tr>
<tr>
<td>岩国 =&gt; 寺家</td>
<td>山陽本線</td>
<td>青春18きっぷ ※2</td>
</tr>
<tr>
<td>寺家 =&gt; 三原</td>
<td>山陽本線</td>
<td>青春18きっぷ ※2</td>
</tr>
<tr>
<td>三原 =&gt; 岡山</td>
<td>山陽本線</td>
<td>青春18きっぷ ※2</td>
</tr>
<tr>
<td>岡山 =&gt; 東京</td>
<td>山陽本線・東海道本線 サンライズ瀬戸</td>
<td>乗車券 10,670円 + 寝台特急券 9900円 ※3</td>
</tr>
</tbody>
</table>
<ul>
<li>※1：21000ウォンは施設使用料と燃油サーチャージ料、乗船券はインターネット割引の価格</li>
<li>※2：18きっぷは一回あたり2,410円</li>
<li>※3：サンライズ瀬戸はSシングルを利用</li>
</ul>
<p>ざっと3万5千円ほどかかっているので、通常の土日であれば飛行機で成田に飛ぶ方が安いです。しかし、時間と体力がたっぷりある若いうちに自分の手札を使って贅沢な旅をしよう…ということで、飛行機がまだ一般的でなかった時代の主要経路を選択しました。</p>
<p>今回は釜関フェリーで一泊、サンライズ瀬戸で一泊と、帰路だけで合計二泊しましたが、より短い行程に収めたい場合は 釜山 =&gt; 大阪のフェリー を使うことで一泊二日で帰ることもできそうです。</p>
<h4>出発の地、ソウル駅</h4>
<p>今回の旅の始まり、ソウル駅です。
旅の始まり…といいつつ、実は行きも船と鉄道でソウルまで来ており、ここまでで既に家を出てから5日経過しています。それなりに家が恋しくなっています。</p>
<p>ソウル駅の隣には、2004年まで駅舎として使われていた旧駅舎が残っています。残念ながら今回は内部で何か展示会を開催していて入れなかったのですが、釜関フェリーで東京に行くのが常識だった時代の人になりきったつもりで旧京城駅舎を拝みましょう。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/soul-old-station.png" alt="" /></p>
<p>ソウル駅の切符売り場です。品川駅に少し似てる気はしつつ、駅というより空港のような雰囲気です。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/soul-station-lobby.png" alt="" /></p>
<p>窓口で切符を購入しホームへ向かうと、だだっ広いホームが広がっています。日本と異なりホームへ行くまでに改札がなく、チケットを持ってそのまま列車に乗り込むことができます。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/soul-station-home.png" alt="" /></p>
<p>ソウルから大邱までは、ムグンファ号という機関車牽引型の列車を選びました。日本だと一部の観光列車を除いて機関車が牽引する客車に乗り込むタイプはない気がするので、日常利用されてる客車列車は新鮮です！</p>
<p>チケットは<a href="https://www.letskorail.com/ebizbf/EbizBfBookingTrainSearch.do#hdposition">Korailの外国人向けWebサイトからオンライン購入</a>することもできるのですが、どんな乗車券が発券されるか興味があったので、窓口で現金で購入してみました。窓口の係員さんにカタコトの英語で欲しい内容を伝えると、日本のみどりの窓口と同じように？赤鉛筆で印を付けながら確認してくださり、問題なく購入することができました。日本の固い磁気が入った切符と異なり、レシートにQRコードが印字されているタイプでした。ただ、QRコードを読み取る機会はなかったので、どういう場合にQRコードを使うのは謎のままです。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/mugunghwa-front.png" alt="" /></p>
<p>ムグンファ号の車内です。正直、かなり古い車両だと予想してたので覚悟してたのですが、とても快適でした。東京からソウルへ行った往路ではKTXという韓国の高速鉄道に乗ったのですが、そちらは椅子を回転させることができないため終始後ろ向きで乗車だったので、なんならムグンファ号の方が乗車体験良いのでは…？とさえ感じました。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/mugunghwa.png" alt="" /></p>
<p>ムグンファ号は、京釜線を爽快に進みます。ムグンファ号は、「のぞみ」や「はやぶさ」のような列車愛称ではなく、日本における「快速」のような種別に近い意味合いです。京釜線以外にも様々な路線を走っています。</p>
<p>車窓を眺めていて印象的だったのが、このタケノコのように田んぼの中にそびえるマンション群です。乗車中、いたる所に山形某所のような田んぼの中に生えるマンション群があります。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/mugunghwa-window-view.png" alt="" /></p>
<p>このままムグンファ号で乗り換えなしに釜山まで行くこともできるのですが、ソウルと釜山以外の都市も散策したく、韓国第三の都市、大邱駅で降りてみました。</p>
<p>大邱では、モノレールに乗ってみました。高層ビルやマンションが立ち並ぶ街並みをモノレールが走ります。乗換駅では日本語による放送も流れます。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/daegu-monorail.png" alt="" /></p>
<p>モノレールは地下鉄と改札なしで乗り換えることができ、運賃も通し計算です。日本のSuicaのような韓国内の交通用ICカード、Tマネーカードなどが使えます。一回きりの都度購入の場合、ほんの少し料金は上がりますがこのようなトークンを購入すれば交通用ICカードが無くても乗れます。トークン内にはチップが埋め込まれているため、改札内に入場する場合にはICカードのようにタッチ、改札外に出場する場合にはコインのように改札機に投入します。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/daegu-monorail-token.png" alt="" /></p>
<p>大邱を後に、釜山へ向け出発です。大邱から釜山はITXという日本の在来線特急に乗りました。今回はネットで購入しました。ホームの端から写真を撮ろうとした所、立ち入り禁止だったらしく、韓国の大規模駅はホームの端に行くと監視カメラに自動検知され、かなり怖い音と放送で自動的に警告されました…。そのため、連結部分の写真しかとれませんでした。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/itx.png" alt="" /></p>
<p>釜山駅に到着！</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/busan-station.png" alt="" /></p>
<p>下関と釜山を結ぶ関釜フェリーは、韓国の会社が保有する「星希」と日本の会社が保有する「はまゆう」の2隻あり、今回は韓国籍の「星希」の方でした。
出国審査の都合なのか、21時に出港に関わらず受付手続きは17:30までに済ませる必要がありました。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/ferry.png" alt="" /></p>
<p>いよいよ釜山港を出発です。
甲板から釜山の夜景を見ながら海風にあたる時間がこの旅で一番いい時間だった気がします。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/busan-port.png" alt="" /></p>
<p>虹色に光り輝く釜山大橋が釜山港の出口です。ライトアップの色が移り変わる様子は船旅の醍醐味！！</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/bridge.png" alt="" /></p>
<p>釜山大橋の向こうに見える釜山の夜景がかすれてきました。これにて韓国はお別れです。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/bridge-2.png" alt="" /></p>
<p>下関上陸後は、鈍行で広島までコトコト揺られ、広島県の寺家に住む従弟と遊び、その夜にサンライズで東京へ向かいます。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/sunrise.png" alt="" /></p>
<p>釜関フェリーの中で予約したのですがシングルなら取れました！ノビノビ座席だとあと6000円ほどお安くなります。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/sunrise-room.png" alt="" /></p>
<p>大阪駅でなにかあったようで、東京駅へは40分遅れでの到着。ソウル駅を出てから約48時間、韓国国内の在来線、船、日本の在来線で東京までたどり着くことができました。</p>
<p><img src="https://takoyaki-3.github.io/takoyaki3-com-data/contents/media/202408/tokyo-station.png" alt="" /></p>
<p>在来線と船でもたった2日で到達できる…！！鉄道と船だけで海外を往復した感想として、むしろ近さを感じました。</p>
<h4>余談</h4>
<p>この後会社に直行した所、さすがに疲労でか体調を崩し、38.6度の熱を出しました…。己の体力の限界を知りました🫠</p>`

export const SoulToTokyo = () => (
  <ContentDisplay page={{ ...soleToTokyoPageMeta }} pageHTML={soleToTokyoPage} />
);