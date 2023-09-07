const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
require('dotenv').config();


var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const app = express();

app.use(cors());

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const NOTION_SECRET = process.env.NOTION_SECRET;
const DATABASE_ID = process.env.DATABASE_ID;

const notion = new Client({ auth: NOTION_SECRET });

app.post('/submitFormToNotion', jsonParser, async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const comment = req.body.comment;
    const projectType = req.body.projectType;

    function formatDateTo12Hour(timestamp) {
        const date = new Date(timestamp);

        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        if (hours > 12) {
            hours -= 12;
        } else if (hours === 0) {
            hours = 12;
        }
    
        const formattedDate = `${month} ${day} ${year} - ${hours}:${minutes} ${ampm}`;
        
        return formattedDate;
    }

    const timestamp = new Date();
    const formattedTimestamp = formatDateTo12Hour(timestamp);

    try {
        const response = await notion.pages.create({
            parent: { database_id: DATABASE_ID },
            properties: {

                Name: {
                    title: [
                        {
                            text: {
                                content: name
                            }
                        }
                    ]
                },

                "Email": {
                    rich_text: [
                        {
                            text: {
                                content: email
                            }
                        }
                    ]
                },

                "Comments / Feedback": {
                    rich_text: [
                        {
                            text: {
                                content: comment
                            }
                        }
                    ]
                }, 

                "Project Type": {
                    rich_text: [
                        {
                            text: {
                                content: projectType
                            }
                        }
                    ]
                },

                "Date of Submission": {
                    rich_text: [
                        {
                            text: {
                                content: formattedTimestamp
                            }
                        }
                    ]
                }

            }
        })

        console.log(response);
        console.log("SUCCESS");
    } catch (error) {
        console.log(error);
    }
})

app.listen(PORT, HOST, () => {
    console.log("Starting proxy at " + HOST + ":" + PORT);
});
