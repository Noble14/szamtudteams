const Syllabus = {
    "A tárgy célja, követelmények": new Date('2023-03-20'),
    "ZH eredmények": new Date('2023-03-20'),
    "Tudásbázis": new Date('2023-03-20'),
    "1. hét": new Date('2023-03-20'),
    "2. hét": new Date('2023-03-20'),
    "3. hét": new Date('2023-03-20'),
    "4. hét - 1. Géptermi ZH": new Date('2023-03-29'),
    "5. hét": new Date('2023-03-19'),
    "6. hét": new Date('2023-03-26'),
    "7. hét": new Date('2023-04-09'),
    "8. hét - 2. Géptermi ZH": new Date('2023-04-16'),
    "9. hét": new Date('2023-04-23'),
	"10. hét": new Date('2023-04-30'),
    "11. hét": new Date('2023-05-03'),
    "12. hét - 3. Géptermi ZH": new Date('2023-05-10'),
    "13. hét - Projektfeladat ZH": new Date('2023-05-10'),
    "Szoftvertechnológia I feladatlap-gyűjtemény": new Date('2023-07-09'),
    "Szoftvertechnológia I összefoglaló feladatsor": new Date('2023-07-09'),
    "Projektfeladatok": new Date('2023-04-10'),
	"Projektfeladat: Életjáték":new Date('2023-04-10'),
    "Projektfeladat: Hajós oktató":new Date('2023-04-10'),
    "Projektfeladat: Memóriajáték folytatása":new Date('2023-04-10'),
    "Projektfeladat: Szótanító játék":new Date('2023-04-10'),
    "Projektfeladat: Akasztófa játék":new Date('2023-04-10'),
    "Projektfeladat: Labirintus játék":new Date('2023-04-10'),
    "Projektfeladat: Kígyós játék almákkal":new Date('2023-04-10'),
	"Projektfeladat: Keresd a különbséget játék": new Date('2023-04-10'),
	"Hasznos info": new Date('2023-03-20'),
	"Visual Studio 2022 telepítése": new Date('2023-03-20'),
	"Azure": new Date('2023-03-20'),
	"Azure fiók regisztrálása": new Date('2023-03-20'),
	"SQL adatbázis létrehozása Azure-ban": new Date('2023-03-20'),
	"Azure költségek követése": new Date('2023-03-20'),
	"MS SQL Server Express telepítése": new Date('2023-03-20'),
	"Lokális adatbázis létrehozása Visual Studio-ban": new Date('2023-03-20'),
	"UI tervezés": new Date('2023-03-20'),
	"In-memory adatbázis": new Date('2023-03-20'),
	"Távoli adatbázis elérése": new Date('2023-03-20'),
	"Többtáblás adatbázisok tervezése": new Date('2023-03-20'),
	"Tanulmányi adatbázis felépítése": new Date('2023-03-20'),
	"UI építése tanulmányi adatbázishoz": new Date('2023-03-20'),
	"LINQ": new Date('2023-03-20'),
	"LINQ öszefoglaló": new Date('2023-03-20'),
	"LINQ alkalmazási példa": new Date('2023-03-20'),
	"8. hét": new Date('2023-03-20'),
	"Grafika": new Date('2023-03-20'),
	"9. hét - 2. Géptermi ZH": new Date('2023-03-20'),
	"Checklist az második ZH- hoz": new Date('2023-03-20'),      

};

var socket;

function preprocess(){
	hideTOC();
	const title = document.querySelector("h1")
	const parent = title.parentNode
	console.log(parent)

	var activeUsersDiv = document.createElement("div")
	activeUsersDiv.id = "activeUsers"

	parent.insertBefore(activeUsersDiv, title)
	
	let ps=document.querySelectorAll("p");
	let taskCount=0;
	for(var i=0; i<ps.length; i++){
		if(ps[i].innerHTML.indexOf("(+/-)")==0){
			taskCount++;
			let t=document.createElement("span");
			t.innerHTML="<span class=\"tg_cnt\">#"+taskCount+"</span><span>✓</span><span>?</span>";
			t.classList.add("tg_task");
			t.classList.add("tg_taskctrl");
			t.classList.add("tg_neutral");
			
			
			t.id="task"+taskCount;
			
			let text=ps[i].innerText;
			text=text.substring(6,text.length);
			ps[i].innerHTML="";
			
			let teamsButton=document.createElement("button");
			teamsButton.innerText="kérj segitséget"
			


			ps[i].appendChild(t);
			ps[i].appendChild(teamsButton);
			ps[i].innerHTML+=text;
			//ps[i].addEventListener("click", taskClicked);
		}
		else if(ps[i].innerHTML.indexOf("(!Vid)")==0){
			let text=ps[i].innerText;
			let a=document.createElement("a");

			text=text.substring(7,text.length);
			a.innerHTML=text;
			ps[i].innerHTML="";
			ps[i].appendChild(a);
			ps[i].addEventListener("click", videoClicked);
		}
		else if(ps[i].innerHTML.indexOf("(!Hint)")==0){
			taskCount++;
			let t=document.createElement("span");
			t.innerHTML="<span class=\"tg_cnt\">#"+taskCount+"</span><span>✓</span><span>?</span>";
			t.classList.add("tg_task");
			t.classList.add("tg_taskctrl");
			t.classList.add("tg_neutral");
			
			
			t.id="task"+taskCount;
			let hint=ps[i].innerText;
			let text=ps[i].innerText;
			let p=document.createElement("p");

			hint=hint.substring(text.indexOf("[!")+2,hint.length-1);
			text=text.substring(8,text.indexOf("[!")-1);
			p.innerHTML=hint;
			
			p.classList.add("hidden");
			p.classList.add("hint");
			ps[i].innerHTML="";
			ps[i].appendChild(t);
			ps[i].innerHTML+=text;
			ps[i].appendChild(p);
			//ps[i].addEventListener("click", taskClicked);
		}
	}
	
	let videos=$(".embeddedvideo");

	for(let i=0;i<videos.length;i++){
		videos[i].classList.add("hidden");
		videos[i].children[0].target=videos[i].children[0].scr;
		videos[i].children[0].scr="";
	}
	
	let children=$("#_content")[0].children;
	let stepperCount=0;
	let stepCount=0;
	for(let i=0;i<children.length;i++){
		if(children[i].innerHTML.indexOf("(!Stepper)")==0){
			stepperCount++;
			children[i].innerHTML="";
			children[i].appendChild(generateStepper(stepperCount));
			i++;
			while(children[i].innerHTML.indexOf("(!EndStepper)")==-1){
				if(children[i].innerHTML.indexOf("(!Step)")==0){
					stepCount++;
				   	children[i].classList.add("hidden");
					children[i].classList.add("stepDescription");
				}
				if(children[i].innerHTML.indexOf("(!EndStep)")==0){
				   	children[i].innerHTML="";
				}
				if(stepCount>1){
					children[i].classList.add("hidden");
				}
				children[i].classList.add("stepperStep-"+stepperCount);
				children[i].classList.add("step-"+stepCount);
				i++;
			}
			if(children[i].innerHTML.indexOf("(!EndStepper)")==0){
				   	children[i].innerHTML="";
					try {
						$("#stepper-" + stepperCount)[0].firstChild.innerHTML = document.querySelector(".stepDescription.step-1.stepperStep-" + stepperCount).innerHTML.substring(8, document.querySelector(".stepDescription.step-1.stepperStep-" + stepperCount).innerHTML.length-1);
						stepCount=0;
					} catch (error) {
						setTimeout(() => {
							$("#stepper-" + stepperCount)[0].firstChild.innerHTML = document.querySelector(".stepDescription.step-1.stepperStep-" + stepperCount).innerHTML.substring(8, document.querySelector(".stepDescription.step-1.stepperStep-" + stepperCount).innerHTML.length-1);
							stepCount=0;
						}, 100);
					}
					   
				}
		}
	}
	
	
}
function callClicked(e) {
	console.log("call clicked")
	microsoftTeams.app.initialize().then(x => {
		microsoftTeams.authentication.getAuthToken({scopes : ["OnlineMeetings.ReadWrite"]}).then((result) => {
			microsoftTeams.app.getContext().then((context) => {
				tid = context.user.tenant.id
//				fetch('/startMeeting', {
//					method: 'post',
//					headers: {
//						'Content-Type': 'application/json'
//					},
//					body: JSON.stringify({
//						'tid': tid,
//						'token': result
//					}),
//					mode: 'cors',
//					cache: 'default'
//				}).then( response =>  {
//					if (response.error) {
//						console.log(error)
//					} else {
//						return response.json()
//					}
//				}).then(data =>{
//					console.log(data.joinUrl)
//					window.location.replace(data.joinUrl)
					
//				})
				var meetingData = {
					"tid" :  tid,
					"subject" : "Help me",
					"token" : result
				}
				console.log("sending message")
				console.log(socket)
				socket.emit("startMeeting", meetingData)
			})
		})
	})
}
function taskClicked(e) {
    let el = e.target;
    //console.log(el);
    if (!el.id) {
        el = el.parentNode; //
    }

	callClicked()
    let ele = el; //.firstChild
    console.log(e.target.id + " was clicked");
    let newStatus = "";
    if (ele.classList.contains("tg_neutral")) {
        ele.classList.remove("tg_neutral");
        ele.classList.add("tg_success");
        newStatus = "+";

    } else
        if (ele.classList.contains("tg_success")) {
            ele.classList.remove("tg_success");
            ele.classList.add("tg_fail");
            newStatus = "-";
		if(e.target.parentNode.parentNode.children[e.target.parentNode.parentNode.children.length-1].classList.contains("hint")){
			showHint(e.target.parentNode.parentNode.children[e.target.parentNode.parentNode.children.length-1]);
		}
		
        } else if (ele.classList.contains("tg_fail")) {
            ele.classList.remove("tg_fail");
            ele.classList.add("tg_neutral");
            newStatus = "0";
		if(e.target.parentNode.parentNode.children[e.target.parentNode.parentNode.children.length-1].classList.contains("hint")){
			hideHint(e.target.parentNode.parentNode.children[e.target.parentNode.parentNode.children.length-1]);
		}
        }

    //ws.send(`S ${el.id.substring(4)} ${newStatus}`);
}
function showHint(p){
	p.classList.remove("hidden");
}
function hideHint(p){
	p.classList.add("hidden");
}
function videoClicked(e){
	let el = e.target;
	if(el.parentNode.nextElementSibling.classList.contains("hidden")){
		el.parentNode.nextElementSibling.classList.remove("hidden");
		videos[i].children[0].scr=videos[i].children[0].target;
		
	}else{
		el.parentNode.nextElementSibling.classList.add("hidden");
	}
	
}
function hideTOC(){
	let k=0;
	try{
		let tabs=document.getElementById("toc").children[0].children;
		for(let i=0;i<tabs.length;i++){
			if(!shouldTitleBeVisible(tabs[i].querySelector("a").innerText)){
			tabs[i].classList.add("hidden");
			}
		}
	}catch(er){
		k++;
		setTimeout(hideTOC,k*100);
	}
	
	
}
function shouldTitleBeVisible(title) {
    const currentDate = new Date();
    if (Syllabus.hasOwnProperty(title) && currentDate > Syllabus[title]) {
        return true;
    }
    return false;
}
function generateStepper(i){
	// Get the parent element where the HTML will be appended
	

	// Create the main container
	const stepperContainer = document.createElement('p');
	stepperContainer.id = 'stepper-'+i;
	stepperContainer.className = 'stepper';
	stepperContainer.classList.add("alert");

	// Create the text container
	const textContainer = document.createElement('p');
	textContainer.className = 'stepper-text';
	textContainer.textContent = '';
	stepperContainer.appendChild(textContainer);

	// Create the chevron up button
	const chevronUpButton = document.createElement('div');
	chevronUpButton.classList.add("step-chevron-up","inactive");
	chevronUpButton.addEventListener("click", onStepperArrowClicked.bind(chevronUpButton));
	const chevronUpSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	chevronUpSvg.setAttribute('aria-hidden', 'true');
	chevronUpSvg.classList.add('svg-icon');
	const chevronUpPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	chevronUpPath.setAttribute('d', 'M2 25h32L18 9 2 25Z');
	chevronUpPath.classList.add("inactive");
	chevronUpSvg.appendChild(chevronUpPath);
	chevronUpButton.appendChild(chevronUpSvg);
	// Create the step counter
	const stepCounter = document.createElement('div');
	stepCounter.className = 'step-counter';
	stepCounter.textContent = '1.';
	

	// Create the chevron down button
	const chevronDownButton = document.createElement('div');
	chevronDownButton.classList.add("step-chevron-down");
	chevronDownButton.addEventListener("click", onStepperArrowClicked.bind(chevronDownButton));
	const chevronDownSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	chevronDownSvg.setAttribute('aria-hidden', 'true');
	chevronDownSvg.classList.add('svg-icon');
	const chevronDownPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	chevronDownPath.setAttribute('d', 'M2 11h32L18 27 2 11Z');
	
	chevronDownSvg.appendChild(chevronDownPath);
	chevronDownButton.appendChild(chevronDownSvg);

	// Append the buttons to the chevron div
	const chevronDiv = document.createElement('div');
	chevronDiv.className = 'step-chevron-div';
	chevronDiv.appendChild(chevronUpButton);
	chevronDiv.appendChild(stepCounter);
	chevronDiv.appendChild(chevronDownButton);
	stepperContainer.appendChild(chevronDiv);



	return stepperContainer;
}
function onStepperArrowClicked(arrow){
	arrow=(arrow.target.classList.contains("svg-icon"))?arrow.target.firstChild:arrow.target;
	let children=$("#_content")[0].children;
	let stepDescriptions=$(".stepDescription");
	if(arrow.classList.contains("inactive")){
		return;
	}
	let nth=0;
	for(let i=1;i<100;i++){
		if(arrow.parentElement.parentElement.parentElement.parentElement.id==("stepper-"+i)){
			nth=i;
			break;
		}
	}
	let maxSteps=0;
	for(let i=1;i<1000;i++){
		if($(".stepperStep-"+nth)[$(".stepperStep-"+nth).length-1].classList.contains("step-"+i)){
			maxSteps=i;
			break;
		}
	}
	
	let counter=Number(arrow.parentElement.parentElement.parentElement.children[1].innerHTML);
	if(arrow.parentElement.parentElement.classList.contains("step-chevron-down")){
		if(counter+1<=maxSteps){
			arrow.parentElement.parentElement.parentElement.children[1].innerHTML=counter+1+".";
			for(let i=0;i<children.length;i++){
				if(children[i].classList.contains("step-"+counter)&&children[i].classList.contains("stepperStep-"+nth)){
					children[i].classList.add("hidden");
				}			
			}
			counter=Number(arrow.parentElement.parentElement.parentElement.children[1].innerHTML);
			let desc="";
			for(let i=0;i<stepDescriptions.length;i++){
				if(stepDescriptions[i].classList.contains("step-"+counter)&&stepDescriptions[i].classList.contains("stepperStep-"+nth)){
					desc=stepDescriptions[i].innerHTML.substring(8,stepDescriptions[i].innerHTML.length-1);
				}
			}
			arrow.parentElement.parentElement.parentElement.parentElement.children[0].innerHTML=desc;
			if(counter==maxSteps){
				arrow.classList.add("inactive");
				arrow.parentElement.parentElement.classList.add("inactive");
			}else if(counter>1){
				arrow.parentElement.parentElement.parentElement.children[0].firstChild.firstChild.classList.remove("inactive");
				arrow.parentElement.parentElement.parentElement.children[0].classList.remove("inactive");
			}
			for(let i=0;i<children.length;i++){
				if(children[i].classList.contains("step-"+counter)&&children[i].classList.contains("stepperStep-"+nth)){
					children[i].classList.remove("hidden");
				}
			}
			
		}
	}else{
		
		if(counter-1>=1){
			arrow.parentElement.parentElement.parentElement.children[1].innerHTML=counter-1+".";
			for(let i=0;i<children.length;i++){
				if(children[i].classList.contains("step-"+counter)&&children[i].classList.contains("stepperStep-"+nth)){
					children[i].classList.add("hidden");
				}			
			}
			counter=Number(arrow.parentElement.parentElement.parentElement.children[1].innerHTML);
			let desc="";
			for(let i=0;i<stepDescriptions.length;i++){
				if(stepDescriptions[i].classList.contains("step-"+counter)&&stepDescriptions[i].classList.contains("stepperStep-"+nth)){
					desc=stepDescriptions[i].innerHTML.substring(8,stepDescriptions[i].innerHTML.length-1);
				}
			}
			arrow.parentElement.parentElement.parentElement.parentElement.children[0].innerHTML=desc;
			if(counter==1){
				arrow.classList.add("inactive");
				arrow.parentElement.parentElement.classList.add("inactive");
			}else if(counter<maxSteps){
				arrow.parentElement.parentElement.parentElement.children[2].firstChild.firstChild.classList.remove("inactive");
				arrow.parentElement.parentElement.parentElement.children[2].classList.remove("inactive");
			}
			for(let i=0;i<children.length;i++){
				if(children[i].classList.contains("step-"+counter)&&children[i].classList.contains("stepperStep-"+nth)){
					children[i].classList.remove("hidden");
				}
					
			}
			
		}
	}
	
}
function lumos(m=""){
	if (m=="maxima") {
		const elements = document.querySelectorAll('.hidden, .stepDescription');
		elements.forEach(element => {
		  element.classList.remove('hidden', 'stepDescription');
		});
	}else{
		let tabs=document.getElementById("toc").children[0].children;
		for(let i=0;i<tabs.length;i++){
			tabs[i].classList.remove("hidden");
		}
	}
	
}

function getClientSideToken() {
    return new Promise((resolve, reject) => {
		microsoftTeams.app.initialize().then(() => {
			microsoftTeams.authentication.getAuthToken().then((result) => {
				resolve(result);
			}).catch((error) => {
				reject("Error getting token: " + error);
			});
		})
    });
}
function getMeetingDetails() {
  console.log("get meeting clicked");

  return new Promise((resolve) => {
    microsoftTeams.app.initialize().then(() => {
      microsoftTeams.authentication.getAuthToken({
        scopes: ["OnlineMeetings.ReadWrite"],
      }).then((result) => {
        microsoftTeams.app.getContext().then((context) => {
          const tid = context.user.tenant.id;
          const meetingData = {
            tid: tid,
            subject: "Help me",
            token: result,
          };
          resolve(meetingData);
        });
      });
    });
  });
}
function joinWebSocket() {
	var activeUsers = document.getElementById("activeUsers")
	getClientSideToken().then(token => {
		microsoftTeams.app.initialize().then(() => {
			microsoftTeams.app.getContext().then((context) => {
				var tid = context.user.tenant.id
				var url = new URL(window.location.href)
				var roomForSocket = url.pathname
				console.log("hello")
				console.log(roomForSocket)
				var socket = io({
					auth: {
						"token": token,
						"tid": tid,
					},
					extraHeaders : {
						"room" : roomForSocket
					}
				})
				socket.on('connect', () => {
					console.log("connected to server")
					socket.on('new-user' , x => {
						activeUsers.innerHTML=""
						x.forEach(e => {
							let p = document.createElement("p")
							p.innerText = e
							activeUsers.appendChild(p)
							console.log(p)
						});
					}) 
					const buttons = document.querySelectorAll("button")
					buttons.forEach(x => {
						x.addEventListener('click', ()  => {
							getMeetingDetails().then(details =>socket.emit("start-meeting", details))
						})
					})
					socket.on("meeting-started", (url, targets) => {
						console.log(url)
						//window.open(url, '_blank')
						//window.location.replace()
						console.log(targets)
					})
					socket.on("place-call", (targets => {
						microsoftTeams.call.startCall({"targets" : targets})
						                   .then(x => console.log("sikeres hivas"))
										   .catch(x => console.log(x))

					}))
				})
				return socket;
			})
		})
	})
}
function loadScript(src) {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script")
		script.src=src
		document.head.appendChild(script)
		script.onload = () => resolve(script)
		script.onerror = () => reject(new Error(`failed to load: ${src}`))
	})
}
window.addEventListener('load',() => { 
	preprocess() 
	Promise.all([
		loadScript("https://res.cdn.office.net/teams-js/2.9.1/js/MicrosoftTeams.min.js"),
		loadScript("https://cdn.socket.io/4.5.4/socket.io.min.js"),
	]).then((scripts) => {
		console.log("Libraries loaded")
		socket = joinWebSocket()
	}).catch(error => {
		console.error("Failed to load: " + error)
	}).then( () => {
		microsoftTeams.app.initialize().then( ()  => {
			microsoftTeams.app.getContext().then(context =>{
				if(context?.page?.id) 
				console.log(context.channel.id)
				else {
					console.log( "jajj")
				}
				var url = new URL(window.location.href)
				var path = url.pathname
				const modified_url = path.replaceAll("/", "@")
				
				const title = document.querySelector("h1").innerText

				getChatId(modified_url).then(r => {
					const callBackConversation = function (convResp) {
						console.log(convResp.conversationId)
						postChatId(modified_url, convResp.conversationId).then(r => {
							console.log("conv id: ", r)
						})
					}
					console.log(r)
					
					console.log("ok")
					microsoftTeams.conversations.openConversation({
						"conversationId" : r == false ? "" : r,
						"subEntityId":"task-1",
						"entityId": path, 
						"channelId": context.channel.id,
						"title": title,
						onStartConversation: callBackConversation
					})
						//onStartConversation: callBackConversation
				})
			})
		})
	})
  }, false);

  function getChatId(path) {
	return new Promise((resolve, reject)=> {
		fetch(`/conversation/${path}`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			cache: 'default'
		}).then( response =>  { 
			if (response.ok)
				return response.json()
			else
				reject(response.error)
		}).then(respJson => {
			resolve(respJson)
		})
	})
  }
  function postChatId(path, id) {
	return new Promise((resolve, reject)=> {
		fetch(`/conversation`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'path' : path,
				'id' : id
			}),
			mode: 'cors',
			cache: 'default'
		}).then( response =>  { 
			if (response.ok)
				return response.json()
			else
				reject(response.error)
		}).then(respJson => {
			resolve(respJson)
		})
	})
  }