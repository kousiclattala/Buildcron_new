import React from 'react';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import moment from 'moment';
import FileViewer from 'react-native-file-viewer';
import {Alert} from 'react-native';

var questions = [];
var siteDetails = [];
var project = [];

export const htmlToPdf = async (data) => {
  //   console.log('inside report file -->', data);

  const name = data.name;
  questions = data.inspectionQuestions;
  siteDetails = data.siteDetails;
  project = data.project;

  let options = {
    html: `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Pdf Content</title>
            <style>
                div {
                    background: #EEE;
                    border-width: 4px;
                    border-radius: 10px;
                    margin-bottom: 15px;
                }

                h1 {
                    text-align: center;
                    font-size: 24px;
                    text-transform: uppercase;
                }

                h3 {
                    text-align: center;
                    font-size: 20px;
                    font-weight: 900;
                }

                h5 {
                    font-size: 16px;
                    font-weight: 600;
                    padding-left: 20px;
                    padding-top: 15px;
                }

                p {
                    font-size: 14px;
                    marging-top: 5px;
                    marging-left: 30px;
                    padding-left: 20px;
                    padding-bottom: 10px
                }

                span {
                    background: green;
                    color: white;
                    border-radius: 5px;
                    margin-left: 30px;
                    margin-bottom: 10px;
                    padding: 10px;
                }

                article {
                    background: #EEE;
                    border-width: 4px;
                    border-radius: 10px;
                    margin-bottom: 15px;
                    height: 100px;
                }

                section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #EEE;
                    padding-right: 30px;
                }
            </style>
        </head>
        <body>
            <h1>${name}</h1>
            <h3>Site Details</h3>
            <div>
                <h5>Area Being Inspected</h5>
                <p>${siteDetails.areaInspected}</p>
            </div>
            <div>
                <h5>Inspection Material Quantity</h5>
                <p>${siteDetails.inspectionMaterialQuantity}</p>
            </div>
            
            <section>
                <div>
                    <h5>Inspection Quantity</h5>
                    <p>${siteDetails.inspQuantity}</p>
                </div>

                <div>
                    <h5>UOM</h5>
                    <p>${siteDetails.uom}</p>
                </div>
            </section>

            <div>
                <h5>Contractor Responsible</h5>
                <p>${siteDetails.contractorResponsible}</p>
            </div>

            <div>
                <h5>Project Name</h5>
                <p>${project.name}</p>
            </div>

            <div>
                <h5>Project Location</h5>
                <p>${project.location}</p>
            </div>

            <div>
                <h5>Date of Inspection</h5>
                <p>${moment(Date.now()).format('MMM D YYYY hh:mm A')}</p>
            </div>

            <div>
                <h5>Document Number</h5>
                <p>Doc xxx xxx xxx</p>
            </div>
            

            <h3>Checklist Questions</h3>

            <article>
                <h5>
                ${questions.map((ques) => {
                  return ques.question;
                })}
                </h5>
                <span>
                ${questions.map((ques) => {
                  return ques.status;
                })}
                </span>
            </article>
            
        </body>
    </html>
    `,
    fileName: `${name}`,
    directory: 'Documents/buildcron',
  };

  let file = await RNHTMLtoPDF.convert(options);

  alert('Report Generated successfully');

  //   Alert.alert(
  //     'Report Generated',
  //     `Do you want to see the Report, ${file.filePath}`,
  //     [
  //       {
  //         text: 'Cancel',
  //         onPress: () => {
  //           //
  //         },
  //       },
  //       {
  //         text: 'Open',
  //         onPress: () => openFile(file.filePath),
  //       },
  //     ],
  //   );

  const openFile = (filePath) => {
    var path = filePath;
    FileViewer.open(path)
      .then(() => console.log('File opened successfully'))
      .catch((err) => {
        console.log('Error in opening file');
        alert('Error in opening file');
      });
  };

  return file;
};

{
  /* <section>
                    ${questions.map((ques) => {
                      return (
                        <article>
                          <h5>{ques.question}</h5>
                          <span>{ques.status}</span>
                        </article>
                      );
                    })}
                </section> */
}

const htmlContent = `
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Pdf Content</title>
                <style>
                    div {
                        background: #EEE;
                        border-width: 4px;
                        border-radius: 10px;
                        margin-bottom: 15px;
                    }

                    h1 {
                        text-align: center;
                        font-size: 24px;
                    }

                    h3 {
                        text-align: center;
                        font-size: 20px;
                        font-weight: 900;
                    }

                    h5 {
                        font-size: 16px;
                        font-weight: 600;
                        padding-left: 20px;
                        padding-top: 15px;
                    }

                    p {
                        font-size: 14px;
                        marging-top: 5px;
                        marging-left: 30px;
                        padding-left: 20px;
                        padding-bottom: 10px
                    }

                    span {
                        background: green;
                        color: white;
                        border-radius: 5px;
                        margin-left: 30px;
                        margin-bottom: 10px;
                        padding: 10px;
                    }

                    article {
                        background: #EEE;
                        border-width: 4px;
                        border-radius: 10px;
                        margin-bottom: 15px;
                        height: 100px;
                    }
                </style>
            </head>
            <body>
                <h1>Reinforcement Report</h1>
                <h3>Site Details</h3>
                <div>
                    <h5 >Area Being Inspected</h5>
                    <p>Towe 1, 5th floor slab</p>
                </div>
                <div>
                    <h5 >Inspection Material Quantity</h5>
                    <p>Sample Material Quantity 30</p>
                </div>
                <div>
                    <h5 >Inspection Quantity</h5>
                    <p>200</p>
                    <h5 >UOM</h5>
                    <p>100</p>
                </div>
                <div>
                    <h5 >Contractor Responsible</h5>
                    <p>Sample Contractor Name</p>
                </div>
                

                <h3>Checklist Questions</h3>
                <p>${JSON.stringify(questions)}</p>
                
            </body>
        </html>
    `;
