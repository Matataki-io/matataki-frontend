<template>
  <div class="contract">
    <div class="row">
      <div class="title">
        <button>
          瞬Matataki用户服务协议
        </button>
      </div>
      <div v-html="content" />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  data() {
    return {
      content: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.content = [
        '<p>欢迎您来到瞬Matataki。</p>',
        '            <p>',
        '                请您仔细阅读以下条款，如果您对本协议的任何条款表示异议，您可以选择不进入瞬Matataki。当您注册成功，无论是进入瞬Matataki，还是在瞬Matataki上发布任何内容（即“内容”），以及直接或通过各类方式（如站外API引用等）间接使用瞬Matataki服务和数据的行为，均意味着您（即“用户”）完全接受本协议项下的全部条款。</p>',
        '            <p>若您对本声明的任何条款有异议，请停止使用瞬Matataki所提供的全部服务。</p>',
        '            <div class="title2">一、总则</div>',
        '            <p>1. 瞬Matataki社区 meta.io 的所有权和运营权归上海秋比科技有限公司所有。</p>',
        '            <p>2. 用户在使用本社区的服务之前，应当仔细阅读本协议，并同意遵守本协议及所有社区规则后方可注册成为瞬Matataki用户，一旦用户注册成功，则用户与本社区之间自动形成协议关系，用户应当受本协议及所有社区规则的约束。用户在使用特殊的服务或产品时，应当同意接受相关协议后方能使用。',
        '            </p>',
        '            <p>3. 本协议、社区规则可由本社区随时更新，用户在接收瞬Matataki服务时应当及时关注，用户同意本社区不承担通知义务。本社区已发布仍有效的和将来发布的通知、公告、声明或其它类似内容是本协议及社区规则的一部分。</p>',
        '            <div class="title2">二、用户帐号</div>',
        '            <p>1. 本社区不接受无民事行为能力和限制民事行为能力人注册本社区账号，任何冒用无、限制民事行为能力人名义注册账号的，瞬Matataki有权立即注销该账号，相关法律责任由冒用人承担。</p>',
        '            <p>2. 无民事行为能力人和限制民事行为能力人确因特殊情况需要注册账号的，应和站方联系并提交相关证明进行申请，但站方有权不予同意。</p>',
        '            <p>3. 用户可通过以下方式注册成为瞬Matataki社区的正式用户：</p>',
        '            <p>3.1 经本社区会员系统完成注册程序并通过实名认证的用户。</p>',
        '            <p>3.2 经社区批准的第三方合作网站登录并通过实名认证的用户。</p>',
        '            <p>4. 成为瞬Matataki正式用户即获得本社区规定用户所应享有的一切权限，未经实名认证仅享有本社区规定的部分会员权限，瞬Matataki社区有权对会员的权限设计进行变更。</p>',
        '            <p>5. 使用本社区会员系统注册的用户，只能使用汉字、英文字母、数字、下划线及它们的组合，否则瞬Matataki有权不予注册或强制更改。</p>',
        '            <p>6. 如发现用户帐号中含有不雅文字或不恰当名称的，本社区保留取消其用户资格的权利。</p>',
        '            <p>7. 用户帐号的所有权归本社区，用户仅享有使用权以及账号中有商业价值的虚拟财产所有权。连续一年未使用的用户帐号，本社区保留收回的权利。</p>',
        '            <div class="title2">三、服务内容</div>',
        '            <p>1. 瞬Matataki服务的具体内容由瞬Matataki社区根据实际情况提供，包括但不限于授权用户通过其帐号使用瞬Matataki服务发布文章、观点、评论、图片、视频、转发链接等。</p>',
        '            <p>2.',
        '                用户理解，瞬Matataki社区仅提供与瞬Matataki服务相关的技术服务等，除此之外与相关网络服务有关的设备（如个人电脑、手机、及其他与接入互联网或移动网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费）均应由用户自行负担。</p>',
        '            <p>3.',
        '                除非本协议另有其它明示规定，增加或强化目前本服务的任何新功能，包括所推出的新产品，均受到本协议之规范。您了解并同意，本服务仅依其当前所呈现的状况提供，对于任何用户信息或个人化设定之时效、删除、传递错误、未予储存或其它任何问题，瞬Matataki均不承担任何责任。</p>',
        '            <div class="title2">四、服务变更、中断或终止</div>',
        '            <p>1.',
        '                鉴于网络服务的特殊性（包括但不限于服务器的稳定性问题、恶意的网络攻击等行为的存在及其他瞬Matataki社区无法控制的情形），用户同意瞬Matataki社区有权随时中断或终止部分或全部的瞬Matataki服务，若发生该等中断或中止瞬Matataki服务的情形，瞬Matataki社区将尽可能及时通过网页公告、系统通知、私信、短信提醒或其他合理方式通知受到影响的用户。</p>',
        '            <p>2.',
        '                用户理解，瞬Matataki社区需要定期或不定期地对提供瞬Matataki服务的社区（如互联网网站、应用程序等）或相关的设备进行检修或者维护，如因此类情况而造成服务在合理时间内的中断，瞬Matataki社区无需为此承担任何责任，但瞬Matataki社区应尽可能事先进行通告。</p>',
        '            <p>3. 如发生下列任何一种情形，瞬Matataki社区有权随时中断或终止向用户提供本协议项下的瞬Matataki服务而无需对用户或任何第三方承担任何责任，由此造成的损失由用户自行独立承担：</p>',
        '            <p>3.1 用户提供的个人资料不真实。</p>',
        '            <p>3.2 用户违反法律法规国家政策或本协议中规定的使用规则。</p>',
        '            <p>3.3 用户侵犯自然人和单位合法权益的，包括但不限于侮辱、诽谤、谩骂公民个人，诋毁单位商誉或信誉等。</p>',
        '            <p>3.4 用户损害监管部门、国家机关及政府形象。</p>',
        '            <p>3.5 用户以任何方式损害瞬Matataki社区及其关联公司的商誉或信誉等合法权益。</p>',
        '            <p>3.6 其他瞬Matataki社区认为需要中断或终止向用户提供瞬Matataki服务的。</p>',
        '            <p>4. 如用户在申请开通瞬Matataki服务后在任何连续1年内未实际使用，则瞬Matataki社区有权选择采取以下任何一种方式进行处理：</p>',
        '            <p>4.1 回收用户昵称。</p>',
        '            <p>4.2 回收用户帐号，或停止为该用户提供瞬Matataki服务。</p>',
        '            <p>5 用户选择将瞬Matataki帐号与瞬Matataki合作的第三方帐号进行绑定的，除用户自行解除绑定关系外，如发生下列任何一种情形，用户已绑定的第三方帐号也有可能被解除绑定，瞬Matataki社区无需对用户或任何第三方承担任何责任：</p>',
        '            <p>5.1 用户违反法律法规国家政策、本协议的。</p>',
        '            <p>5.2 用户违反第三方用户服务协议或其相关规定的。</p>',
        '            <p>5.3 第三方账户所属的站方要求解除绑定的。</p>',
        '            <p>5.4 第三方账户所述社区或业务已关停的。</p>',
        '            <p>5.5 依据法律法规、政策规定、或主管部门要求的。</p>',
        '            <p>5.6 瞬Matataki社区认为需要解除绑定的。</p>',
        '            <div class="title2">五、使用规则</div>',
        '            <p>1. 用户注册成功后，瞬Matataki将给予每个用户一个用户帐号及相应的密码，该用户帐号和密码由用户负责保管。用户应当对以其用户帐号进行的所有活动和事件负法律责任。</p>',
        '            <p>2. 用户可自行编辑注册信息中的帐号名称、昵称、头像、简介等（以下简称“帐号信息”），但应遵守“七条底线”以及相关管理规定，不得含有违法和不良信息。同时，</p>',
        '            <p>2.1 请勿以党和国家领导人或其他名人的真实姓名、字、号、艺名、笔名、头衔等注册和使用昵称（如确为本人，需要提交相关证据并通过审核方可允许使用）。</p>',
        '            <p>2.2 请勿以国家组织机构或其他组织机构的名称等注册和使用昵称（如确为该机构，需要提交相关证据并通过审核方可允许使用）。</p>',
        '            <p>2.3 请勿注册和使用与其他网友相同、相仿的名字或昵称。</p>',
        '            <p>2.4 请勿注册和使用不文明、不健康的ID和昵称，包括但不限于歧视、侮辱、猥亵类词语的。</p>',
        '            <p>2.5 请勿注册和使用易产生歧义、引起他人误解或带有各种奇形怪状符号的ID和昵称。</p>',
        '            <p>2.6 用户以虚假信息骗取账号名称注册，或账号头像、简介等注册信息存在违法和不良信息的，瞬Matataki将暂停或注销。</p>',
        '            <p>3.',
        '                未经相关权利人授权，用户不得以他人或其他组织机构名义注册瞬Matataki帐号，亦不得使用引人误解的帐号信息注册瞬Matataki帐号，包括但不限于让人误认为该帐号与某社会名人或机构组织存在关联关系的名称、头像或简介等。用户须对在瞬Matataki的注册信息的真实性、合法性、有效性承担全部责任，用户不得冒充他人。不得利用他人的名义发布任何信息。不得恶意使用注册帐号导致其他用户误认。否则瞬Matataki有权立即停止提供服务，收回其帐号并由用户独自承担由此而产生的一切法律责任。</p>',
        '            <p>4. 用户直接或通过各类方式（如 RSS 源和站外 API 引用等）间接使用瞬Matataki服务和数据的行为，都将被视作已无条件接受本协议全部内容。若用户对本协议的任何条款存在异议，请停止使用瞬Matataki所提供的全部服务。</p>',
        '            <p>5.',
        '                瞬Matataki是一个内容发布、分享及获取的社区，用户通过瞬Matataki发表的信息为公开的信息，其他第三方均可以通过瞬Matataki获取用户发表的信息，用户对任何信息的发表即认可该信息为公开的信息，并单独对此行为承担法律责任。任何用户不愿被其他第三人获知的信息都不应该在瞬Matataki上进行发表。</p>',
        '            <p>6. 用户不得利用瞬Matataki服务制作、上载、复制、发布、传播或者转载如下内容：</p>',
        '            <p>6.1 反对宪法所确定的基本原则的。</p>',
        '            <p>6.2 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的。</p>',
        '            <p>6.3 损害国家荣誉和利益的。</p>',
        '            <p>6.4 煽动民族仇恨、民族歧视，破坏民族团结的。</p>',
        '            <p>6.5 破坏国家宗教政策，宣扬邪教和封建迷信的。</p>',
        '            <p>6.6 散布谣言，扰乱社会秩序，破坏社会稳定的。</p>',
        '            <p>6.7 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的。</p>',
        '            <p>6.8 侮辱或者诽谤他人，侵害他人合法权益的。</p>',
        '            <p>6.9 含有法律、行政法规禁止的其他内容的信息。</p>',
        '            <p>7.',
        '                瞬Matataki有权对用户使用瞬Matataki的情况进行审查和监督，如用户在使用瞬Matataki时违反任何上述规定，瞬Matataki或其授权的人有权要求用户改正或直接采取一切必要的措施（包括但不限于更改或删除用户张贴的内容、暂停或终止用户使用瞬Matataki的权利）以减轻用户不当行为造成的影响。</p>',
        '            <p>8.',
        '                用户同意瞬Matataki社区在提供瞬Matataki服务过程中以各种方式投放各种商业性广告或其他任何类型的商业信息（包括但不限于在瞬Matataki社区网站的任何页面上投放广告），并且，用户同意接受瞬Matataki社区通过电子邮件、私信或其他方式向用户发送商品促销或其他相关商业信息。</p>',
        '            <div class="title2">六、知识产权</div>',
        '            <p>1. 瞬Matataki是一个内容发布、分享及获取的社区，我们尊重和鼓励瞬Matataki用户创作的内容，认识到保护知识产权对瞬Matataki生存与发展的重要性，承诺将保护知识产权作为瞬Matataki运营的基本原则之一。</p>',
        '            <p>2. 用户在瞬Matataki上发表的全部原创内容（包括但不仅限于文章和评论），著作权均归用户本人所有。用户可授权第三方以任何方式使用，不需要得到瞬Matataki的同意。</p>',
        '            <p>3.',
        '                瞬Matataki提供的网络服务中包含的标识、版面设计、排版方式、文本、图片、图形等均受著作权、商标权及其它法律保护，未经相关权利人（含瞬Matataki及其他原始权利人）同意，上述内容均不得在任何社区被直接或间接发布、使用、出于发布或使用目的的改写或再发行，或被用于其他任何商业目的。</p>',
        '            <p>4.',
        '                为了促进信息的创作和分享，用户将其在瞬Matataki上发表的全部内容，授予瞬Matataki免费的、不可撤销的、非独家使用许可，瞬Matataki有权将该内容用于瞬Matataki各种形态的产品和服务上，包括但不限于网站以及发表的应用或其他互联网产品。</p>',
        '            <p>5.',
        '                第三方若出于非商业目的，将用户在瞬Matataki上发表的内容转载在瞬Matataki之外的地方，应当在作品的正文开头的显著位置注明原作者姓名（或原作者在瞬Matataki上使用的帐号名称），给出原始链接，注明“发表于瞬Matataki”，并不得对作品进行修改演绎。若需要对作品进行修改，或用于商业目的，第三方应当联系用户获得单独授权，按照用户规定的方式使用该内容。</p>',
        '            <p>6. 瞬Matataki为用户提供“保留所有权利，禁止转载”的选项。除非获得原作者的单独授权，任何第三方不得转载标注了“禁止转载”的内容，否则均视为侵权。</p>',
        '            <p>7.',
        '                在瞬Matataki上传或发表的内容，用户应保证其为著作权人或已取得合法授权，并且该内容不会侵犯任何第三方的合法权益。如果第三方提出关于著作权的异议，瞬Matataki有权根据实际情况删除相关的内容，且有权追究用户的法律责任。给瞬Matataki或任何第三方造成损失的，用户应负责全额赔偿。</p>',
        '            <p>8.',
        '                如果任何第三方侵犯了瞬Matataki用户相关的权利，用户同意授权瞬Matataki或其指定的代理人代表瞬Matataki自身或用户对该第三方提出警告、投诉、发起行政执法、诉讼、进行上诉，或谈判和解，并且用户同意在瞬Matataki认为必要的情况下参与共同维权。</p>',
        '            <p>9. 瞬Matataki有权但无义务对用户发布的内容进行审核，有权根据相关证据结合《侵权责任法》、《信息网络传播权保护条例》等法律法规及瞬Matataki社区指导原则对侵权信息进行处理。</p>',
        '            <div class="title2">七、个人隐私</div>',
        '            <p>1.',
        '                尊重用户个人隐私信息的私有性是瞬Matataki的一贯原则，瞬Matataki将通过技术手段、强化内部管理等办法充分保护用户的个人隐私信息，除法律或有法律赋予权限的政府部门要求或事先得到用户明确授权等原因外，瞬Matataki保证不对外公开或向第三方透露用户个人隐私信息，或用户在使用服务时存储的非公开内容。</p>',
        '            <p>2. 本社区可能会与第三方合作向用户提供相关的网络服务，在此情况下，如该第三方同意承担与本社区同等的保护用户隐私的责任，则本社区有权将用户的注册资料等提供给该第三方。</p>',
        '            <p>3. 在不透露单个用户隐私资料的前提下，本社区有权对整个用户数据库进行分析并对用户数据库进行商业上的利用。</p>',
        '            <div class="title2">八、侵权举报</div>',
        '            <p>1. 处理原则</p>',
        '            <p>瞬Matataki作为信息发布、分享及获取社区，高度重视自由表达和个人、企业正当权利的平衡。依照法律规定删除违法信息是瞬Matataki社区的法定义务，瞬Matataki社区亦未与任何中介机构合作开展此项业务。</p>',
        '            <p>2. 受理范围</p>',
        '            <p>2.1 受理瞬Matataki社区内侵犯企业或个人合法权益的侵权举报，包括但不限于涉及个人隐私、造谣与诽谤、商业侵权。</p>',
        '            <p>2.2 涉及个人隐私：发布内容中直接涉及身份信息，如个人姓名、家庭住址、身份证号码、工作单位、私人电话等详细个人隐私。</p>',
        '            <p>2.3 造谣、诽谤：发布内容中指名道姓或含沙射影地对他人（包括自然人和单位）的谩骂、侮辱、虚构中伤、恶意诽谤等。</p>',
        '            <p>2.4 商业侵权：泄露企业商业机密及其他根据保密协议不能公开的内容。</p>',
        '            <p>3. 举报条件</p>',
        '            <p>3.1',
        '                用户在瞬Matataki发表的内容仅表明其个人的立场和观点，并不代表瞬Matataki的立场或观点。如果个人或企业发现瞬Matataki上存在侵犯自身合法权益的内容，可以先尝试与作者取得联系，通过沟通协商解决问题。如您无法联系到作者，或无法通过与作者沟通解决问题，请与瞬Matataki取得联系（邮箱：about@andoromeda.io）。为了保证问题能够及时有效地处理，请务必提交真实有效、完整清晰的材料，否则投诉将无法受理。您需要向瞬Matataki提供的投诉材料包括：</p>',
        '            <p>3.1.1 权利人对涉嫌侵权内容拥有商标权、著作权和/或其他依法可以行使权利的权属证明，权属证明通常是营业执照或组织机构代码证。</p>',
        '            <p>3.1.2 举报人的身份证明，身份证明可以是身份证或护照。</p>',
        '            <p>3.1.3 如果举报人非权利人，请举报人提供代表权利人进行举报的书面授权证明。</p>',
        '            <p>3.2 为确保投诉材料的真实性，在侵权举报中，您还需要签署以下法律声明：</p>',
        '            <p>3.2.1 我本人为所举报内容的合法权利人。</p>',
        '            <p>3.2.2 我举报的发布在瞬Matataki社区中的内容侵犯了本人相应的合法权益。</p>',
        '            <p>3.2.3',
        '                如果本侵权举报内容不完全属实，本人将承担由此产生的一切法律责任，并承担和赔偿瞬Matataki因根据投诉人的通知书对相关帐号的处理而造成的任何损失，包括但不限于瞬Matataki因向被投诉方赔偿而产生的损失及瞬Matataki名誉、商誉损害等。</p>',
        '            <p>4. 处理流程</p>',
        '            <p>4.1 出于网络社区的监督属性，并非所有申请都必须受理。瞬Matataki自收到举报的七个工作日内处理完毕并给出回复。处理期间，不提供任何电话、邮件及其他方式的查询服务。</p>',
        '            <p>4.2',
        '                出现瞬Matataki已经删除或处理的内容，但是百度、谷歌等搜索引擎依然可以搜索到的现象，是因为百度、谷歌等搜索引擎自带缓存，此类问题瞬Matataki无权也无法处理，因此相关申请不予受理。您可以自行联系搜索引擎服务商进行处理。</p>',
        '            <p>4.3 此为瞬Matataki社区唯一的官方侵权投诉渠道，暂不提供其他方式处理此业务。</p>',
        '            <p>4.4 用户在瞬Matataki中的商业行为引发的法律纠纷，由交易双方自行处理，与瞬Matataki无关。</p>',
        '            <div class="title2">九、免责声明</div>',
        '            <p>1. 瞬Matataki不能对用户发表的内容或评论的正确性进行保证。</p>',
        '            <p>2.',
        '                用户在瞬Matataki发表的内容仅表明其个人的立场和观点，并不代表瞬Matataki的立场或观点。作为内容的发表者，需自行对所发表内容负责，因所发表内容引发的一切纠纷，由该内容的发表者承担全部法律及连带责任。瞬Matataki不承担任何法律及连带责任。</p>',
        '            <p>3. 瞬Matataki不保证网络服务一定能满足用户的要求，也不保证网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作保证。</p>',
        '            <p>4. 对于因不可抗力或瞬Matataki不能控制的原因造成的网络服务中断或其它缺陷，瞬Matataki不承担任何责任，但将尽力减少因此而给用户造成的损失和影响。</p>',
        '            <p>5. 用户因个人问题造成的任何操作失误和财产损失，瞬Matataki均不承担任何责任，包括但不限于账户密码被盗、转错钱包地址、遗失、被盗窃等情况。</p>',
        '            <p>6. 本社区不保证为方便用户而设置的外部链接的准确性和完整性，同时，对于该等外部链接指向的不由本社区实际控制的任何网页上的内容，本社区不承担任何责任。</p>',
        '            <p>7. 对于本社区向用户提供的下列产品或者服务的质量缺陷本身及其引发的任何损失，本社区无需承担任何责任：</p>',
        '            <p>7.1 本社区向用户免费提供的各项网络服务。</p>',
        '            <p>7.2 本社区向用户赠送的任何产品或者服务。</p>',
        '            <p>7.3 本社区向收费网络服务用户附赠的各种产品或者服务。</p>',
        '            <div class="title2">十、协议修改</div>',
        '            <p>1.',
        '                根据互联网的发展和有关法律、法规及规范性文件的变化，或者因业务发展需要，瞬Matataki有权对本协议的条款作出修改或变更，一旦本协议的内容发生变动，瞬Matataki将会直接在瞬Matataki网站上公布修改之后的协议内容，该公布行为视为瞬Matataki已经通知用户修改内容。瞬Matataki也可采用电子邮件或私信的传送方式，提示《瞬Matataki用户服务协议》条款的修改、服务变更、或其它重要事项。</p>',
        '            <p>2. 如果不同意瞬Matataki对本协议相关条款所做的修改，用户有权并应当停止使用瞬Matataki。如果用户继续使用瞬Matataki，则视为用户接受瞬Matataki对本协议相关条款所做的修改。</p>',
        '            <div class="title2">十一、附则</div>',
        '            <p>1. 本协议自用户注册成功时对用户生效，协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律，有关诉讼由上海秋比科技有限公司所在地的法院管辖。</p>',
        '            <p>2. 如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍应有效并且有约束力。</p>',
        '            <p>3. 本协议解释权及修订权归上海秋比科技有限公司所有。</p>'
      ].join('')
    }
  }
}
</script>

<style lang="less">
.contract {
  font-size: 14px;
  font-family: Helvetica, "Microsoft YaHei", Arial, SansSerif;
  font-style: normal;
  line-height: 1;
  background: #fff;
  -webkit-font-smoothing: antialiased;
  color: #676767;
  outline: 0;
  .row::after,
  .row::before {
    content: " ";
    display: table;
  }

  .row::after {
    clear: both;
  }

  .row {
    margin: 0 100px;
  }

  .title {
    font-size: 24px;
    color: #000;
    font-weight: 700;
    line-height: 40px;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 20px;
  }

  button {
    font-size: 20px;
    background: none;
    border: none;
    cursor: pointer;
    color: #ccc;
    outline: none;
  }

  button:first-child {
    color: #542DE0;
  }

  button:hover {
    color: #542DE0;
  }

  .title span {
    font-size: 20px;
    font-weight: 400;
  }

  .title2 {
    font-size: 18px;
    color: #000;
    font-weight: 700;
    line-height: 34px;
  }

  p {
    margin: 14px 0;
    line-height: 1.5;
    padding: 0;
    letter-spacing: 1px;
  }

  a {
    color: #542DE0;
    text-decoration: none;
  }

  /*#content {*/
  /*animation: .5s fadeIn 1s alternate forwards;*/
  /*-webkit-animation: .5s fadeIn 1s alternate forwards;*/
  /*-moz-animation: .5s fadeIn 1s alternate forwards;*/
  /*}*/
  /*@keyframes fadeIn {*/
  /*0% {*/
  /*opacity: .1*/
  /*}*/
  /*20% {*/
  /*opacity: .2;*/
  /*}*/
  /*30% {*/
  /*opacity: .3;*/
  /*}*/
  /*40% {*/
  /*opacity: .4;*/
  /*}*/
  /*50% {*/
  /*opacity: .5;*/
  /*}*/
  /*60% {*/
  /*opacity: .6;*/
  /*}*/
  /*70% {*/
  /*opacity: .7;*/
  /*}*/
  /*80% {*/
  /*opacity: .8;*/
  /*}*/
  /*90% {*/
  /*opacity: .9;*/
  /*}*/
  /*100% {*/
  /*opacity: 1;*/
  /*}*/
  /*}*/
  /*@-webkit-keyframes fadeIn {*/
  /*0% {*/
  /*opacity: .1*/
  /*}*/
  /*20% {*/
  /*opacity: .2;*/
  /*}*/
  /*30% {*/
  /*opacity: .3;*/
  /*}*/
  /*40% {*/
  /*opacity: .4;*/
  /*}*/
  /*50% {*/
  /*opacity: .5;*/
  /*}*/
  /*60% {*/
  /*opacity: .6;*/
  /*}*/
  /*70% {*/
  /*opacity: .7;*/
  /*}*/
  /*80% {*/
  /*opacity: .8;*/
  /*}*/
  /*90% {*/
  /*opacity: .9;*/
  /*}*/
  /*100% {*/
  /*opacity: 1;*/
  /*}*/
  /*}*/
  /*@-moz-keyframes fadeIn {*/
  /*0% {*/
  /*opacity: .1*/
  /*}*/
  /*20% {*/
  /*opacity: .2;*/
  /*}*/
  /*30% {*/
  /*opacity: .3;*/
  /*}*/
  /*40% {*/
  /*opacity: .4;*/
  /*}*/
  /*50% {*/
  /*opacity: .5;*/
  /*}*/
  /*60% {*/
  /*opacity: .6;*/
  /*}*/
  /*70% {*/
  /*opacity: .7;*/
  /*}*/
  /*80% {*/
  /*opacity: .8;*/
  /*}*/
  /*90% {*/
  /*opacity: .9;*/
  /*}*/
  /*100% {*/
  /*opacity: 1;*/
  /*}*/
  /*}*/

  @media (max-width: 480px) {
    .row {
      margin: 0 10px;
    }

    .title {
      margin-bottom: 0;
    }

    .title2 {
      margin-top: 20px;
    }

    p {
      text-align: justify;
    }

    button {
      font-size: 12px;
    }

    .title span {
      font-size: 12px;
    }
  }
}
</style>
