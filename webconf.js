/* API WebConference
----REQUEST ---------------------------------ENDPOINT---------------------------
                            /
autentication               /  POST signin
participants register       /  POST conferences/1/participants/{email}
speaker btnRegister         /  POST speakers
connect speaker             /  POST conferences/1/speakers/{speakerId}
up-to-date speaker          /  PUT  conferences/1/speakers/{speakerId}
get speakers                /  GET  conferences/1/speakers
remove speaker              /  DELETE conferences/1/speakers/{speakerId}
get sponsors                /  GET conferences/1/sponsors
send message                /  POST contacts/emails
                            /
###############################################################################
*/



//onload event to execute all code when HTML content is ready in memory to be render
window.onload = function() {
  const urlBase = "https://fcawebbook.herokuapp.com";

  //code to manipulate DOM
  const btnRegister = document.getElementById("btnRegister");
  btnRegister.addEventListener("click", function() {
    console.log('estou aqui: ');

    //swal is't a method form library sweetalert2
    //html it's the code tobe rendering inside the modal
    swal({
      title: "Subscription in Web Conference",
      html:
      '<input id="txtName" class="swal2-input" placeholder="name">' +
      '<input id="txtEmail" class="swal2-input" placeholder="e-mail">',
      showCancelButton: true,
      confirmButtonText: "Subscription",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,

      //executed before confirm action (return a Promise object)
      preConfirm: () => {
        const name = document.getElementById('txtName').value;
        const email = document.getElementById('txtEmail').value;
        return fetch(`${urlBase}/conferences/1/participants/${email}`, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            body: `participantname=${name}`
          })
        .then(response => {
          if(!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .catch(error => {
          swal.showValidationError(`Request failed: ${error}`);
        });
      },

      //if false user isn't allowed to cancel the modal windon when clicked out
      allowOutsideClick: () => !swal.isLoading()
    }).then(result => {
      console.log('result: ', result.value);

      if(result.value.success) {
        if(!result.value.err_code) {
          swal({title: 'Subscription made with success!'})
        } else {
          swal({title: `${result.value.err_message}`})
        }
      }

    });
  });


  /*
    Get speakers from server
  */
( async () => {
  const renderSpeakers = document.getElementById("renderSpeakers");
  let txtSpeakers = "";
  let response = await fetch(`${urlBase}/conferences/1/speakers`) //1- means the numeric id of WebConference in data base
  let speakers = await response.json();
  console.log('speakers2: ', speakers);

  for(const speaker of speakers) {
    txtSpeakers += `
    <div class="col-sm-4">
      <div class="team-member">
        <img id="${speaker.idSpeaker}" class="mx-auto rounded-circle viewSpeaker" src="${speaker.photo}" alt="${speaker.name}">
        <h4>${speaker.name}</h4>
        <p class="text-muted">${speaker.role}</p>
        <ul class="list-inline social-buttons">`


      if(speaker.twitter !== null) {
        txtSpeakers += `
        <li class="list-inline-item">
          <a href="${speaker.twitter}" target="_blank">
            <i class="fab fa-twiter"></i>
          </a>
        </li>`
      }

      if(speaker.facebook !== null) {
        txtSpeakers += `
        <li class="list-inline-item">
          <a href="${speaker.facebook}" target="_blank">
            <i class="fab fa-facebook-f"></i>
          </a>
        </li>`
      }

      if(speaker.linkedin !== null) {
        txtSpeakers += `
        <li class="list-inline-item">
          <a href="${speaker.linkedin}" target="_blank">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </li>`
      }

      txtSpeakers += `
              </ul>
          </div>
      </div>`

  // Manage click on image to show modal
      const btnView = document.getElementsByClassName("viewSpeaker")
      for(let i = 0; i < btnView.length; i++) {
        btnView[i].addEventListener("click", () => {
          for(const speaker of speakers) {
            if(speaker.idSpeaker == btnView[i].getAttribute("id")) {
              //Modal window
              swal({
                title: speaker.name,
                text: speaker.bio,
                imageUrl: speaker.photo,
                imageWidth: 400,
                imageHeight: 400,
                imageAlt: 'speaker photo',
                animation: false
              })
            }
          }
        })
      }
    }
    renderSpeakers.innerHTML = txtSpeakers;
}) ();


/*
  Get sponsors from server
*/
( async () => {
  const renderSponsors = document.getElementById("renderSponsors");
  let txtSponsors = "";
  const response = await fetch(`${urlBase}/conferences/1/sponsors`);
  const sponsors = await response.json();
  console.log('sponsors: ', sponsors);

  for (const sponsor of sponsors) {
    txtSponsors += `
    <div class="col-md-3 col-sm-6">
      <a href="#" target="_blank">
        <img class="img-fluid d-block mx-auto" src="${sponsor.logo}" alt="${sponsor.nome}">
      </a>
    </div>`
  }
  renderSponsors.innerHTML = txtSponsors
}) ();


/*
  Post user messages to the server
*/
  const contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", async () => {
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const subject = document.getElementById("subject")
    const response = await fetch(`${urlBase}/conferences/1/contacts/emails`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: `email=${email}&name=${name}&subject=${subject}`
    })
    const result = await response.json()

    if(result.value.success) {
      swal('Message sending', result.value.message.eng, 'success')
    } else {
      //display modal error
      console.log('Erros sending message');
    }
  })

}
