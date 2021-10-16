import React from 'react';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import moment from 'moment';
import {View, Text, Alert} from 'react-native';
import FileViewer from 'react-native-file-viewer';

export const qualityPDF = async (data) => {
  var name = data.name;
  var questions = data.inspectionQuestions;
  var siteDetails = data.siteDetails;
  var project = data.project;

  var questionsList = [];

  questions.map((ques, index) => {
    let html = `
            <div class=${
              ques.status == 'Not Complied'
                ? 'notcomplied-checklist'
                : 'checklist-ques'
            }>
              <div class="question" >
                  <span>${index + 1}</span>
                  <span style="padding-left: 5px">
                      ${ques.question}
                  </span>
              </div>
              <div class="answer">
                  <strong>ANS: </strong>
                  <span class=${
                    ques.status == 'Complied' ? 'complied' : 'notcomplied'
                  }>
                  ${ques.status}
                  </span>
                  ${
                    ques.status == 'Not Complied'
                      ? `<span style="padding-left: 5px"> <strong>Note: </strong> ${ques.reason}</span>`
                      : ''
                  }
              </div>
            </div>
            `;

    questionsList.push(html);
  });

  const generateHtml = (data) => {
    return `
              <!DOCTYPE html>
              <html lang="en">
                  <head>
                      <meta charset="UTF-8" />
                      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <title>PDF Report</title>
                      <link rel="stylesheet" href="styles.css" />
                      <style>
                      .address {
                          display: flex;
                          /* justify-content: center; */
                          align-items: center;
                          margin: 5px;
                        }
                      
                      .address-logo {
                          flex: 1;
                          text-transform: uppercase;
                          font-size: 24px;
                          align-self: center;
                          border: 2px solid #eee;
                          height: 150px;
                          margin: 5px;
                          border-radius: 5px;
                        } 
                      
                      .logo {
                          padding-top: 50px;
                          padding-left: 90px;
                        }
                      
                      .address-proj {
                          flex: 2;
                          align-items: flex-start;
                          border: 2px solid #eee;
                          height: 150px;
                          border-radius: 5px;
                          margin: 5px;
                        }
                      
                      .proj-name {
                          display: flex;
                          flex-direction: row;
                          align-items: center;
                          padding-left: 10px;
                        }
                      /* *checklist div classes */
          
                        .checklist {
                            display: flex;
                            justify-content: center;
                            align-content: center;
                            margin: 5px;
                        }
          
                              .checklist-name {
                              flex: 2;
                              align-self: center;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              height: 70px;
                              margin: 5px;
                              padding-top: 50px;
                              padding-left: 100px;
                              background: #f2f2f2;
                              }
          
                              .dateOfInspection {
                              flex: 1;
                              justify-content: center;
                              align-content: center;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              margin: 5px;
                              padding-top: 25px;
                              padding-left: 10px;
                              }
          
                              /* *area inspected div classes */
          
                              .areaInsp {
                              display: flex;
                              align-items: center;
                              margin: 5px;
                              }
          
                              .area-location {
                              flex: 2;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              height: 90px;
                              padding-left: 15px;
                              margin: 5px;
                              }
          
                              .area-name {
                              display: flex;
                              flex-direction: row;
                              align-items: center;
                              }
          
                              .area-quant {
                              flex: 1;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              height: 90px;
                              }
          
                              .quant {
                              padding-left: 25px;
                              padding-top: 10px;
                              margin: 5px;
                              }
          
                              /* *contractor div classes */
          
                              .contractor {
                              display: flex;
                              align-items: center;
                              margin: 5px;
                              }
          
                              .contractor-name {
                              flex: 1;
                              align-items: center;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              padding-left: 100px;
                              margin: 5px;
                              }
          
                              .inspector-name {
                              flex: 1;
                              align-items: center;
                              border: 2px solid #eee;
                              border-radius: 5px;
                              padding-left: 100px;
                              margin: 5px;
                              }
          
                              .cont-name {
                              padding-top: 10px;
                              }
          
                              .checklist-ques {
                                  display: flex;
                                  align-content: start;
                                  border: 2px solid #eee;
                                  border-radius: 5px;
                                  margin-left: 5px;
                                  margin-right: 5px;
                                  margin-bottom: 10px;
                                  height: 100px;
                                  flex-direction: column;
                              }
      
                              .notcomplied-checklist {
                                  display: flex;
                                  align-content: start;
                                  border: 2px solid #eee;
                                  border-radius: 5px;
                                  margin-left: 5px;
                                  margin-right: 5px;
                                  margin-top: 5px;
                                  margin-bottom: 10px;
                                  height: 100px;
                                  flex-direction: column;
                                  background: #f7edeb;
                              }
          
                              .question {
                                  font-size: 20px;
                                  font-weight: 500;
                                  padding-left: 15px;
                                  padding-top: 10px;
                              }
      
          
                              .answer {
                                  padding-top: 20px;
                                  padding-left: 15px;
                              }
          
                              .complied {
                                  background: #10C000;
                                  color: #fff;
                                  border-radius: 5px;
                                  padding: 10px;
                                  margin-left: 10px;
                              }
          
                              .notcomplied {
                                  background: #E14B2B;
                                  color: #fff;
                                  border-radius: 5px;
                                  padding: 10px;
                                  margin-left: 10px;
                              }
          
                      </style>
          
                  </head>
                  <body>
                      <div>
                      <!-- //* Address div -->
                      <div class="address">
                          <div class="address-logo">
                          <div class="logo">
                              <strong>LOGO</strong>
                          </div>
                          </div>
                          <div class="address-proj">
                          <div class="proj-name">
                              <strong>Project Name: </strong>
                              <p style="padding-left: 5px">${project.name}</p>
                          </div>
                          <div class="proj-name">
                              <strong>Project Address: </strong>
                              <p style="padding-left: 5px">${
                                project.location
                              }</p>
                          </div>
                          <div class="proj-name">
                              <strong>Document</strong>
                              <p style="padding-left: 5px"># Doc123456789</p>
                          </div>
                          </div>
                      </div>
                      <!-- //*checklist name div -->
                      <div class="checklist">
                          <div class="checklist-name">
                          <strong>${name}</strong>
                          </div>
                          <div class="dateOfInspection">
                          <strong style="padding-left: 35px">Date of Inspection</strong>
                          <p style="padding-left: 0px">
                          ${moment(Date.now()).format('MMM D YYYY hh:mm A')}
                          </p>
                          </div>
                      </div>
                      <!-- //* Area Inspected div -->
                      <div class="areaInsp">
                          <div class="area-location">
                          <div class="area-name">
                              <strong>Area Being Inspected: </strong>
                              <p style="padding-left: 5px">${
                                siteDetails.areaInspected
                              }</p>
                          </div>
                          <div class="area-name">
                              <strong>Location: </strong>
                              <p style="padding-left: 5px">Device Location</p>
                          </div>
                          </div>
                          <div class="area-quant">
                          <div class="quant">
                              <strong>Inspection Quantity</strong>
                              <p>${siteDetails.inspQuantity}, ${
      siteDetails.uom
    }</p>
                          </div>
                          </div>
                      </div>
                      <!-- //* contractor div -->
                      <div class="contractor">
                          <div class="contractor-name">
                          <div class="cont-name">
                              <strong>Contractor Responsible</strong>
                              <p>${siteDetails.contractorResponsible}</p>
                          </div>
                          </div>
                          <div class="inspector-name">
                          <div class="cont-name">
                              <strong>Inspected By</strong>
                              <p>Inspector Name</p>
                          </div>
                          </div>
                      </div>
                      </div>
                      
                      ${data.join('')}
                  </body>
              </html>
              `;
  };

  let options = {
    html: generateHtml(questionsList),
    fileName: 'File Test',
    directory: 'Documents',
  };

  let file = await RNHTMLtoPDF.convert(options);

  console.log('test report file data --->', file);

  //   alert('Report Generated success');

  Alert.alert(
    'Report Generated',
    `Do you want to see the Report, ${file.filePath}`,
    [
      {
        text: 'Cancel',
        onPress: () => {
          //
        },
      },
      {
        text: 'Open',
        onPress: () => openFile(file),
      },
    ],
  );
};

const openFile = (file) => {
  var path = file.filePath;
  FileViewer.open(path)
    .then(
      () => (
        console.log('File opened successfully'),
        console.log('file data after opened -->', file)
      ),
    )
    .catch((err) => {
      console.log('Error in opening file');
      alert('Error in opening file');
    });
};
