let records = JSON.parse(localStorage.getItem("records")) || [];
let allowances = JSON.parse(localStorage.getItem("allowances")) || [];
let received = JSON.parse(localStorage.getItem("received")) || [];

let monthly = localStorage.getItem("monthly") || 30000;
let otRate = localStorage.getItem("otRate") || 100;

let isAdmin = false;

/* MENU CONTROL (FIXED) */
function toggleMenu(){
    let m = document.getElementById("menu");
    m.style.left = (m.style.left === "0px") ? "-220px" : "0px";
}

function closeMenu(){
    document.getElementById("menu").style.left = "-220px";
}

/* CLOSE MENU WHEN CLICK OUTSIDE */
document.addEventListener("click", function(e){
    let menu = document.getElementById("menu");
    let btn = document.querySelector(".menu-btn");

    if (!menu.contains(e.target) && !btn.contains(e.target)) {
        closeMenu();
    }
});

/* NAVIGATION */
function goPage(id){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    closeMenu(); // ALWAYS CLOSE
    renderAll();
}

/* ADMIN */
function login(){
    if(user.value==="monicha@143" && pass.value==="monicha@1432"){
        isAdmin = true;
        adminPanel.style.display = "block";
        closeMenu();
    } else {
        alert("Wrong login");
    }
}

function saveRates(){
    if(!isAdmin) return alert("Admin only");

    monthly = document.getElementById("monthly").value;
    otRate = document.getElementById("otRate").value;

    localStorage.setItem("monthly", monthly);
    localStorage.setItem("otRate", otRate);

    alert("Saved");
}

/* PUNCH */
function punchIn(){
    let date = new Date().toLocaleDateString();

    records.push({
        date,
        in:new Date(),
        out:null,
        h:0,
        ot:0
    });

    save();
    renderAll();
}

function punchOut(){
    let r = records[records.length - 1];
    if(!r || r.out) return alert("Punch In first");

    r.out = new Date();

    let h = (r.out - r.in) / 3600000;
    r.h = h.toFixed(2);
    r.ot = h > 8 ? (h - 8).toFixed(2) : 0;

    save();
    renderAll();
}

/* ALLOWANCE */
function addAllowance(){
    if(!aType.value || !aAmount.value) return alert("Fill all");

    allowances.push({
        type: aType.value,
        amt: Number(aAmount.value)
    });

    save();
    renderAll();
}

/* RECEIVED */
function addReceived(){
    if(!rAmount.value) return alert("Enter amount");

    received.push({
        date:new Date().toLocaleDateString(),
        amt:Number(rAmount.value)
    });

    save();
    renderAll();
}

/* WORK TABLE */
function renderWork(){
    let t = document.getElementById("workTable");
    if(!t) return;

    t.innerHTML = "<tr><th>Date</th><th>Hours</th><th>OT</th></tr>";

    records.forEach(r=>{
        t.innerHTML += `
        <tr>
        <td>${r.date}</td>
        <td>${r.h}</td>
        <td>${r.ot}</td>
        </tr>`;
    });
}

/* SALARY */
function renderSalary(){
    let t = document.getElementById("salaryTable");
    if(!t) return;

    let dailyBase = monthly / 30;

    t.innerHTML = "<tr><th>Date</th><th>Base</th><th>OT</th><th>Total</th></tr>";

    records.forEach(r=>{
        let base = dailyBase;
        let ot = r.ot * otRate;
        let total = base + ot;

        t.innerHTML += `
        <tr>
        <td>${r.date}</td>
        <td>${base.toFixed(0)}</td>
        <td>${ot.toFixed(0)}</td>
        <td>${total.toFixed(0)}</td>
        </tr>`;
    });
}

/* RECEIVED TABLE */
function renderReceived(){
    let t = document.getElementById("receivedTable");
    if(!t) return;

    t.innerHTML = "<tr><th>Date</th><th>Amount</th></tr>";

    received.forEach(r=>{
        t.innerHTML += `
        <tr>
        <td>${r.date}</td>
        <td>${r.amt}</td>
        </tr>`;
    });
}

/* MASTER */
function renderAll(){
    renderWork();
    renderSalary();
    renderReceived();
}

/* SAVE */
function save(){
    localStorage.setItem("records", JSON.stringify(records));
    localStorage.setItem("allowances", JSON.stringify(allowances));
    localStorage.setItem("received", JSON.stringify(received));
}