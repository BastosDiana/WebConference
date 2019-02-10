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
  let response = await fetch(`${urlBase}/conferences/1/speakers`)
  let speakers = await response.json();
  console.log('speakers2: ', speakers);

  for(const speaker of Object.keys(speakers)) {
    txtSpeakers += `
    <div class="col-sm-4">
      <div class="team-member">
        <img id="${speaker.idSpeaker}" class="mx-auto rounded-circle viewSpeaker" src="${speaker.photo}" alt="">
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
}) ()


}
