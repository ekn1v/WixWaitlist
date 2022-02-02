import wixLocation from 'wix-location';
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import wixWindow from 'wix-window';
import { contacts, triggeredEmails } from 'wix-crm';

$w.onReady(async function () {
  
  let options = {"suppressAuth": true};
  let user = wixUsers.currentUser;

  $w("#dataset1").onReady( () => {});

// From SignUp to Position
    $w("#[CHANGE TO YOUR BUTTON]").onClick(() => {

      wixData.query("Waitlist")
        .eq('type', 'Waitlist')
        .count()
        .then( (waitlistCount) => {
          console.log('People registered ' + waitlistCount);

          let firstName = $w("#[CHANGE TO YOUR INPUT]").value.toUpperCase();
          let lastName = $w("#CHANGE TO YOUR INPUT").value.toUpperCase();
          let email = $w("#CHANGE TO YOUR INPUT").value.toUpperCase();
          
          let refURL = wixLocation.query;
          console.log(refURL);
      
          if (firstName == '' || lastName == '' || email == ''){
            console.log('Error message: one of the fields is empty')
          } else {

            console.log('No error to this point');
// Check if user exists
            wixData.query("Waitlist").eq('email',email).find(options)
            .then( (results) => {
              if(results.items.length > 0) {
                console.log('User exists');
                let items = results.items;
                let refID = items[0].referralCode;
                let position = items[0].position;
                let friendsReferred = items[0].totalReferrals;
                let referralLink = '[CHANGE TO YOUR WEBSITE]?refID=' + refID.toString();
                $w("#[CHANGE TO YOUR TEXT BOX]").text = referralLink;
                $w("#[CHANGE TO YOUR TEXT BOX]").text = position.toString() + "/" + waitlistCount;
                $w("#[CHANGE TO YOUR TEXT BOX]").text = friendsReferred.toString();
                $w('#EmptyFullStateBox').changeState("Position");
              }
              else { 
                console.log('User does not exist'); 
// if User does not exist, and has been invited by a friend
                if(Object.prototype.hasOwnProperty.call(refURL, 'refID')){
                    let referredFrom = refURL.refID;
                    let refID = waitlistCount + 1;
                    let referralLink = '[CHANGE TO YOUR WEBSITE]?refID=' + refID.toString()
                    console.log(refID);

                    let tosave = {
                      'email': email,
                      'firstName': firstName,
                      'lastName': lastName,
                      'position': refID,
                      'referralCode': refID.toString(),
                      'referral': referredFrom,
                      'totalReferrals': 0,
                      'type': 'Waitlist',
                      'totalSum': refID,
                      }

                    console.log(tosave);
                    wixData.save("Waitlist",tosave)

                    newContact(firstName, lastName, email, referralLink)

                    $w("#[CHANGE TO YOUR TEXT BOX]").text = referralLink;
                    $w("#[CHANGE TO YOUR TEXT BOX]").text = refID.toString() + "/" + refID.toString();
                    $w("#[CHANGE TO YOUR TEXT BOX]").text = '0';

  // handle the other side, who referred
                    wixData.query("Waitlist")
                      .eq('referralCode', referredFrom)
                      .find(options)
                      .then( (results) => {

                        let toUpdate = {
                          '_id': results.items[0]._id,
                          'email': results.items[0].email,
                          'firstName': results.items[0].firstName,
                          'lastName': results.items[0].lastName,
                          'position': results.items[0].position,
                          'referralCode': results.items[0].referralCode,
                          'referral': results.items[0].referral,
                          'type': 'Waitlist',
                          'totalReferrals': results.items[0].totalReferrals + 1,
                          'totalSum': results.items[0].totalSum - 1,
                        };
                        console.log("Saving contact with referral ID from friend");
                        console.log(toUpdate);

                        wixData.update("Waitlist",toUpdate);

                      } )

                  } else {
// if User does not exist, and signed up on his/her own
                      console.log('No refID found');
                      let refID = waitlistCount + 1;
                      let referralLink = '[CHANGE TO YOUR WEBSITE]?refID=' + refID.toString()
                      console.log(refID);

                      let tosave = {
                        'email': email,
                        'firstName': firstName,
                        'lastName': lastName,
                        'position': refID,
                        'referralCode': refID.toString(),
                        'referral': '',
                        'totalReferrals': 0,
                        'type': 'Waitlist',
                        'totalSum': refID,
                        }

                      console.log("Saving contact without referral ID");
                      console.log(tosave);
                      wixData.save("Waitlist",tosave)

                      newContact(firstName, lastName, email, referralLink)
  
                      $w("#[CHANGE TO YOUR TEXT BOX]").text = referralLink;
                      $w("#[CHANGE TO YOUR TEXT BOX]").text = refID.toString() + "/" + refID.toString();
                      $w("#[CHANGE TO YOUR TEXT BOX]").text = '0';

                  }
              }
              })

              $w("#[CHANGE TO YOUR INPUT BOX]").value = '';
              $w("#[CHANGE TO YOUR INPUT BOX]").value = '';
              $w("#[CHANGE TO YOUR INPUT BOX]").value = '';

              $w('#EmptyFullStateBox').changeState("Position");
            }
          })
          } );

// From Query to Position
    $w("#[CHANGE TO YOUR BUTTON]").onClick(() => {
      $w("#[CHANGE TO YOUR TEXT BOX]").hide(); // this ensures the error message is hidden
      wixData.query("Waitlist")
        .eq('type', 'Waitlist')
        .count()
        .then( (waitlistCount) => {
          console.log('People registered ' + waitlistCount);

          let email = $w("#[CHANGE TO YOUR INPUT BOX]").value.toUpperCase();
          let refURL = wixLocation.query;
          console.log(email);

          wixData.query("Waitlist").eq('email', email).find(options)
              .then( (results) => {
                if(results.items.length > 0) {
                  console.log('User exists');
                  let items = results.items;
                  let refID = items[0].referralCode;
                  let position = items[0].position;
                  let friendsReferred = items[0].totalReferrals;
                  let referralLink = '[CHANGE TO YOUR WEBSITE]?refID=' + refID.toString()
                  $w("#CHANGE TO YOUR TEXT BOX").text = referralLink;
                  $w("#CHANGE TO YOUR TEXT BOX").text = position.toString() + "/" + waitlistCount;
                  $w("#CHANGE TO YOUR TEXT BOX").text = friendsReferred.toString();
                  $w('#EmptyFullStateBox').changeState("Position");
                }
                else { 
                  console.log('User does not exist'); 
                  $w("#[CHANGE TO YOUR TEXT BOX]").show(); // shows error message if the email is not found
                }
            } );
          } );
    } );

// From SignUp to Query
    $w("#[CHANGE TO YOUR BUTTON]").onClick(() => {
      $w('#EmptyFullStateBox').changeState("Query");
    } );

// From Query to SignUp
    $w("#[CHANGE TO YOUR BUTTON").onClick(() => {
      $w("#[CHANGE TO YOUR TEXT BOX]").hide();
      $w("#[CHANGE TO YOUR INPUT]").value = '';
      $w('#EmptyFullStateBox').changeState("SignUp");
    } );

// Copy button
    $w("#[CHANGE TO YOUR BUTTON]").onClick(() => {
      let textToCopy = $w('#[CHANGE TO YOUR TEXT BOX]').text;
      wixWindow.copyToClipboard(textToCopy)
        .then( () => {} )
        .catch( (err) => {
          console.log('Error: could not copy text');
        } );
    } );
  
});


async function newContact(firstName, lastName, userEmail, referralLink){
console.log("inside newContact()");

  const contactInfo = {
    name: {
      first: firstName,
      last: lastName
    },
    emails: [
      {
        email: userEmail,
      },
    ],
  };

  await contacts.appendOrCreateContact(contactInfo)
    .then((resolvedContact) => {
        triggeredEmails.emailContact('YOUR EMAIL ID', resolvedContact.contactId, {
          variables: {
            referralLink: referralLink,
            firstName: firstName
          }
        }
    )
    .catch((error) => {
      console.error(error);
    })
    });
}



// CODE BELOW IS DONE ROUTINELY IN BACK-END BUT IS AN EXAMPLE OF HOW TO UPDATE DATABASE POSITIONS
// export function sortWaitlist() {

//     wixData.query("Waitlist")
//       .ascending("totalSum")
//       .descending("totalReferrals")
//       .ascending("_createdDate")
//       .eq('type', 'Waitlist')
//       .find()
//       .then( (results) => {

//       let count = results.totalCount;
//       let items = results.items;

//       for(var i = 0; i < count; i++){
  
//         let toUpdate = {
//           '_id': items[i].idUpdate,
//           'email': items[i].email,
//           'firstName': items[i].firstName,
//           'lastName': items[i].lastName,
//           'position': i + +1,             // + 1 because query starts at 0
//           'referralCode': items[i].referralCode,
//           'referral': items[i].referral,
//           'type': 'Waitlist',
//           'totalReferrals': items[i].totalReferrals,
//           'totalSum': items[i].totalSum,
//         }

//         console.log(toUpdate);

//         wixData.update("Waitlist",toUpdate);

//         }

//     }) // End getItems
          
// } // End For Loop
