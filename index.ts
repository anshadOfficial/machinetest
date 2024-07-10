import express from "express";
import axios from "axios";

const app = express();
const port = 4000;

const location_Id = "k1F38z3A0efRMHeVkk3v";
const access_token =  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJMb2NhdGlvbiIsImF1dGhDbGFzc0lkIjoiazFGMzh6M0EwZWZSTUhlVmtrM3YiLCJzb3VyY2UiOiJJTlRFR1JBVElPTiIsInNvdXJjZUlkIjoiNjY4ZDQ0MTA5OWFkYzljNDAwYzhhOWY4LWx5ZXRlZ2c0IiwiY2hhbm5lbCI6Ik9BVVRIIiwicHJpbWFyeUF1dGhDbGFzc0lkIjoiazFGMzh6M0EwZWZSTUhlVmtrM3YiLCJvYXV0aE1ldGEiOnsic2NvcGVzIjpbImNvbnRhY3RzLnJlYWRvbmx5IiwiY29udGFjdHMud3JpdGUiLCJsb2NhdGlvbnMvY3VzdG9tRmllbGRzLndyaXRlIiwibG9jYXRpb25zL2N1c3RvbUZpZWxkcy5yZWFkb25seSJdLCJjbGllbnQiOiI2NjhkNDQxMDk5YWRjOWM0MDBjOGE5ZjgiLCJjbGllbnRLZXkiOiI2NjhkNDQxMDk5YWRjOWM0MDBjOGE5ZjgtbHlldGVnZzQifSwiaWF0IjoxNzIwNjEzODU2LjQ4OCwiZXhwIjoxNzIwNzAwMjU2LjQ4OH0.wiOTYY_DsImoiqPpEOGpGvFiAV5PUCR5Owl124tXMCoyNWY8lyKG69Zyw3-9-5bZJiD0aGK_33HmmDhnT4Sn12uev5OsQndTP6JOntBqM2v17wo-8_hHonBeTr7_P4RQlOL5J0JZwgVdcPgePkipt30SHGKfTb_8oN_8DctU7N3QjmWbT1Cb1SWomqVQSZcQ2PI5iFWhDiYKKJf-RbfrkxaBwtOmmk60nfOjeNwgNMFPThAoz6DLTv-X_K0QPiZ7m-MWIu2r5TJfACrby1mZiIyn-kLsWZS2tdQSreCUQLT7X9I5SE9VET0ozqmF9WgMblyN5sdsm7xrMrUxDIA-BnOEB4EwT8i8_RJq1WTvt3y2c6zpYIiOHvBOsuRFrSqyR4DiYVhwT0S8rqtV_ck5uWiyIzP5ZylUe9ADGJwSm3FaHd40Al0mcsqyJ-lhWj0m-7FKJ1EgVcuxm3aQpu-gnq81ljERMiuFFrKMR_28ACLP44fa3-th4G8hAAxN-NdCORkxs5h72iWidyqio0WL3fsn_AAh9ljcTYi-QyYzQKY6aAXd5GkUbnfrbhzxqfFVjziN1VdM1POqb8luD5p0JtrGKBDqWOj49cT7uq6jkWOflksfCuO4ki7B6DOQWTxAiMhYe99jSIcu4tvBXp78fLT6wztqS5xZudJL1TDk49s";


  // for select a randome contact from array of contacts  using Get Contacts API
const fetch_random_contact = async () => {
  try {
    const response = await axios.get(
      "https://services.leadconnectorhq.com/contacts/",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Version: "2021-07-28",
        },
        params: {
          locationId: location_Id,
        },
      }
    );

    const contacts = response.data.contacts;
    if (contacts.length === 0) {
      throw new Error("No contacts found");
    }
    const random_contact =
      contacts[Math.floor(Math.random() * contacts.length)];
    console.log("Contact -", random_contact.id);
    return random_contact.id;


  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw new Error("Failed to fetch contacts");
  }
}; 
//=====================================================================



//  update the contact's custom field using Update contact upi
const update_contact_custom_field = async (
  access_token: string,
  contact_id: String
) => {
  try {
    const resp = await axios.put(
      `https://services.leadconnectorhq.com/contacts/${contact_id}`,
      {
        customFields: [
          {
            // first we need the id of dfs zoom link we need to find it using 
            id: "Pjslqhq89Az2ysMVxOHu", 
           "field_value":"Test"
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Version: "2021-07-28",
        },
      }
    );
    return resp.data;
  } catch (error) {
    console.error("Error updating contact custom field:", error);
    throw new Error("Failed to update contact custom field");
  }
};

// =========================================================================


// Get Endpoint for update contact and return the updated contact 
app.get("/update_contact", async (req, res) => {
  try {
    const contact_id = await fetch_random_contact(); 
    const contact = await update_contact_custom_field(
      access_token, 
      contact_id
    );    

   return res.json({ msg: "Contact updated successfully", contact });

  } catch (err: unknown) {
    const error = err as Error;
    console.error("Error occurred:", error.message);
    res.status(500).send("An error occurred: " + error.message);
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
