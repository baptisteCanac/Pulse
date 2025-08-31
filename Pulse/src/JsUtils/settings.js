const { invoke } = window.__TAURI__.core;

/* 
affichage des données actuelles des réglages en suivant le data.json
*/

let theme = await invoke("get_theme");
theme = parseInt(theme, 10);

let temp = 0;
document.querySelectorAll("#themeSection .radio-button").forEach(element => {
    if (temp === theme){
        element.classList.add("active");
        console.log(element);
    }else{
        element.classList = "radio-button";
    }
    temp ++;
});

/*
interragir avec les données du data.json et les afficher
*/

function setActiveNav(button) {
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.backgroundColor = 'transparent';
        btn.style.color = '#D1D5DB';
    });
            
            // Add active class to clicked button
            button.classList.add('active');
            button.style.backgroundColor = '#374151';
            button.style.color = 'white';
        }

        function toggleSwitch(element) {
            element.classList.toggle('active');
        }

        function setRadio(groupName, element) {
            // Find all radio buttons in the same group
            const parent = element.closest('div');
            const allRadios = parent.querySelectorAll('.radio-button');
            
            // Remove active class from all
            allRadios.forEach(radio => {
                radio.classList.remove('active');
            });
            
            // Add active class to clicked one
            element.classList.add('active');
        }

        // Add hover effects to nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.backgroundColor = '#374151';
                }
            });
            
            btn.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.backgroundColor = 'transparent';
                }
            });
        });