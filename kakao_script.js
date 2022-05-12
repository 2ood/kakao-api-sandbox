const nav = document.querySelector("nav");

const login_button = document.getElementById("login");
const send_myself_button = document.getElementById("send-myself");
const get_token_button = document.getElementById("get-token");
const more_button = document.getElementById("more");
const save_input_button  = document.getElementById("save-input");

const js_key_input = document.querySelector("input[name='javascript-key']");
const rest_key_input = document.querySelector("input[name='rest-key']");
const see_more_input = document.querySelector("input[name='see-more-url']");
const main_text_input = document.getElementById("main-text");

const urlParams = new URLSearchParams(window.location.search);

const REDIRECT_URI = window.location.href.split("?")[0];
let JAVASCRIPT_KEY = localStorage.getItem('JAVASCRIPT_KEY')!=null?localStorage.getItem('JAVASCRIPT_KEY'):'';
let REST_KEY = localStorage.getItem('REST_KEY')!=null?localStorage.getItem('REST_KEY'):'';
let ACCESS_TOKEN = localStorage.getItem('TOKEN')!=null?localStorage.getItem('TOKEN'):'';

let main_text = '';
let see_more_url = '';

refreshKakao();

function loadInputs() {
    if(js_key_input.value!="") JAVASCRIPT_KEY = js_key_input.value;
    if(rest_key_input.value!="") REST_KEY = rest_key_input.value;
    see_more_url = (see_more_input.value==null)?"https://www.naver.com":see_more_input.value;
    main_text = main_text_input.value;
}

function refreshKakao() {
    loadInputs();
    Kakao.init(JAVASCRIPT_KEY);
    Kakao.Auth.setAccessToken(ACCESS_TOKEN);
}

function onLogin() {
    Kakao.Auth.authorize({redirectUri: `${REDIRECT_URI}`});
}

function onSendToMyself() {
    loadInputs();
    alert(`sending ${main_text}\n ${see_more_url}`);
    Kakao.API.request({
        url: '/v2/api/talk/memo/default/send',
        data: {
        template_object: {
            object_type: 'text',
            text : main_text,
            link : {
                web_url : see_more_url,
                mobile_web_url : see_more_url
                }
            }
        },
        success: function(response) {
            alert("send success");
            console.log(response);
        },
        fail: function(error) {
            alert("something is wrong.");
            console.log(error);
        },
    });
}

function onGetToken() {
    let code = urlParams.get('code');
    let par = `grant_type=authorization_code&client_id=${REST_KEY}&redirectUri=${REDIRECT_URI}&code=${code}`;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == this.DONE) {
            let res_json = JSON.parse(xmlHttp.responseText);
            setToken(res_json.access_token);
            alert("token is ready");
        }

    };
    xmlHttp.open("POST", "https://kauth.kakao.com/oauth/token", true);
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlHttp.send(par);
}

function setToken(token) {
     ACCESS_TOKEN = token;
     localStorage.setItem('ACCESS_TOKEN', ACCESS_TOKEN);
     Kakao.Auth.setAccessToken(ACCESS_TOKEN);
}

login_button.addEventListener("click",onLogin);

send_myself_button.addEventListener("click",onSendToMyself);

get_token_button.addEventListener("click",onGetToken);

more_button.addEventListener("click",()=>{
    more_button.classList.toggle("active");
    nav.classList.toggle("active");
});

save_input_button.addEventListener("click",()=>{
    if(confirm("Do you want to refresh key and refresh? \n all texts are erased.")) {
        loadInputs();
        localStorage.setItem('JAVASCRIPT_KEY', JAVASCRIPT_KEY);
        localStorage.setItem('REST_KEY', REST_KEY);
        location.reload();
    }
});
