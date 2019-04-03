/**
 * Scripts together shipped with Reskin work
 *
 * @todo
 *     1. Check user's previllege to enable/disable operation in feature-status page. 
 *        - Pause, Resume, Mark for promotion, Unmark promotion, Decommission, Unmark decommission
 *        Right now, only `admin` is identified
 */

( function () {

/* Globals ****************************************************************************************/

    var $container = $( '.container' );
    var $main = $( '.main' );
    var zone = $( '.main__header' ).data( 'zone' );
    var user = { admin: true } // Required to be integrated user profile

    console.log( 'zone', zone );

/* Toggle menu items - Accodion style *************************************************************/

    $( '.menu__title' ).click( function () {  

        var $icon = $( '.menu__group__icon', this );
        var $currentMenuGroup = $( this ).parent();

        /* Accordion Style */
        // $( '.menu__group' ).removeClass( 'menu__group--expand' );
        // $currentMenuGroup.addClass( 'menu__group--expand' );

        /* Normal expand and collapse */
        $currentMenuGroup.toggleClass( 'menu__group--expand' );
    } );


/* Mobile view toggle *****************************************************************************/

    var $mobileMenuButton = $( '.mobile-menu__button' );

    $mobileMenuButton.click( function () { 

        $container.toggleClass( 'container--mobile' );
    } );

/* Feature status - toggle auto-refresh  **********************************************************/

    $( '.auto-refresh' ).click( function () {

        $( this ).toggleClass( 'auto-refresh--enable' );
    } );

/* Feature status - Feature store header toggle ***************************************************/
    
    $( '.feature-status__header' ).click( function ( event ) {

        if ( $( event.target ).is( '.item.action' ) ) {
            return;
        }

        var $icon = $( '.feature-status__icon-expand', this );
        var $container = $( this ).parent();
        var $content = $( '.feature-status__content', $container );

        if ( $icon.hasClass( 'fa-plus') ) {

            $icon.removeClass( 'fa-plus' ).addClass( 'fa-minus' );
            $container.css( 'align-self', 'stretch');
            $content.show();
        }
        else if (  $icon.hasClass( 'fa-minus') ) {

            $icon.removeClass( 'fa-minus' ).addClass( 'fa-plus' );
            $container.css( 'align-self', 'flex-start');
            $content.hide();
        }
        
    } );

/* Feature status - Feature store toggle, all fixedservices, mobile, etc **************************/

    $( '.strip__feature-store-name' ).click( function () { 

        var $button = $( this );
        var text = $button.text();

        if ( text === 'all' ) {

            $( '.feature-store' ).show();
            $( '.feature-store__header' ).show();
        }
        else {

            $( '.feature-store' ).hide();
            $( '.feature-store__header' ).hide();
            $( '#' + text ).show();
        }
        
        $( '.strip__feature-store-name' ).removeClass( 'strip__feature-store-name--active' );
        $button.addClass( 'strip__feature-store-name--active' );
    } );

/* Feature status - Create featue panel ***********************************************************/

    var feature = {
       "dependencies":{

       },
       "entity":"srvc_bk",
       "featureStore":"fixedservice",
       "scriptLanguage":"SQL",
       "status":{
          "state":"built"
       },
       "createdAt":"2019-03-20T05:22:54.284700",
       "dataSources":{
          "glue":{
             "idv":{
                "s_octf_nbn_srvc":{
                   "name":"s_octf_nbn_srvc",
                   "database":"idv",
                   "service":"glue",
                   "entity":"entity"
                }
             }
          }
       },
       "jobID":"15530593725245125",
       "features":{
          "smoke_test_feature":{
             "featureName":"smoke_test_feature",
             "dataType":"TINYINT"
          }
       },
       "updatedAt":"2019-03-26T20:26:48.599Z",
       "markedForPromotion":{
          "partOf":[
             "15530593725245125"
          ],
          "flag":true
       },
       "batch":"built",
       "scriptLocation":{
          "bucket":"d00-choc-beri-application",
          "file":"scripts/lab/fixedservice/smoke_test_feature.sql"
       }
    };

    var feature2 = {
       "createdAt":"2019-01-24T09:02:23.928107",
       "dataSources":{

       },
       "dependencies":{
          "fixedservice":{
             "entity":"srvc_bk",
             "features":{
                "recd_del_flg":{
                   "factory":true,
                   "featureName":"recd_del_flg"
                },
                "recd_del_flg_bin":{
                   "factory":true,
                   "featureName":"recd_del_flg_bin"
                }
             },
             "featureStore":"fixedservice"
          }
       },
       "entity":"srvc_bk",
       "features":{
          "recd_del_decommission_please":{
             "dataType":"FLOAT",
             "featureName":"recd_del_decommission_please"
          }
       },
       "featureStore":"fixedservice",
       "jobID":"15482809327218018",
       "predictive":{
          "modelInfo":{
             "algorithm":"Gradient Boosting Machine",
             "modelType":"Binomial"
          },
          "predictive":"on",
          "supervised":"true",
          "targetFeature":{
             "feature":"recd_del_flg_bin",
             "featureStore":"fixedservice",
             "zone":"lab"
          },
          "timeDate":{

          }
       },
       "scriptLanguage":"MOJO",
       "scriptLocation":{
          "bucket":"s-choc-beri-application",
          "file":"scripts/lab/fixedservice/GBM_model_python_1540786708091_222.zip"
       },
       "status":{
          "message":"dry run failed on Exception: RequestId: 465779e2-a2b6-4bb2-89ba-15e88e6780ee Process exited before completing request",
          "state":"failed"
       },
       "updatedAt":"2019-01-24T09:02:29.444361"
    }

    var $featureNameClicked = null;
    var $featurePanel = null;

    $( '.feature-status__job' ).click( function () {

        if ( $featurePanel !== null ) {

            $featurePanel.remove();
        }
        
        if ( $( this ).is( $featureNameClicked ) ) {

            $featureNameClicked = null;
        }
        else {

            var feat = $( this ).data( 'feature' );

            if ( feat !== undefined && Object.keys( feat ).length )  {

                $featurePanel = $createFeaturePanel( feat );
                $( '.main__content--feature-status' ).append( $featurePanel );
            }
            else {

                console.warn( '[Choc] Feature details are missing.' );
            }

            $featureNameClicked = $( this );
        }

    } );

    $( '.feature-store' ).each( function () { 

        groupFeatureStatus( $( this ) );

    } );
   
    function groupFeatureStatus( $featureStore ) {

        var itemsOfRows = [ [], [], [], [] ];
        var itemsUnknown = [];

        $( '.feature-status', $featureStore ).each( function () { 

            var $featureStatus = $( this );
            var title = $( '.feature-status__title ', $featureStatus ).text();

            if ( title === 'VALIDATING' ) {

                itemsOfRows[0][0] = $featureStatus;
            }
            else if ( title === 'VALIDATED' ) {

                itemsOfRows[0][1] = $featureStatus;
            }
            else if ( title === 'READY' ) {

                itemsOfRows[0][2] = $featureStatus;
            }
            else if ( title === 'PENDING' ) {

                itemsOfRows[0][3] = $featureStatus;
            }
            else if ( title === 'BUILDING' ) {

                itemsOfRows[1][0] = $featureStatus;
            }
            else if ( title === 'BUILT' ) {

                itemsOfRows[1][1] = $featureStatus;
            }
            else if ( title === 'MARKED FOR PROMOTION' ) {

                itemsOfRows[1][2] = $featureStatus;
            }
            else if ( title === 'MARKED FOR DECOMMISSION' ) {

                itemsOfRows[1][3] = $featureStatus;
            }
            else if ( title === 'DECOMMISSIONING' ) {

                itemsOfRows[1][4] = $featureStatus;
            }
            else if ( title === 'PROMOTED' ) {

                itemsOfRows[2][0] = $featureStatus;
            }
            else if ( title === 'DECOMMISSIONED' ) {

                itemsOfRows[2][1] = $featureStatus;
            }
            else if ( title === 'FAILED' ) {

                itemsOfRows[3][0] = $featureStatus;
            }
            else {

                itemsUnknown.push( $featureStatus );
            }

        } );

        itemsOfRows[3].push( itemsUnknown );

        for ( var i = 0; i < itemsOfRows.length; i ++ ) {

            var $row = $( '<div class="row">' );

            for ( var j = 0; j < itemsOfRows[i].length; j ++ ) {

                $row.append( itemsOfRows[i][j] );
            }

            $( '.feature-store__content', $featureStore ).append( $row );
        }
    }

    function $createFeaturePanel( f ) {

        console.log( 'Feature panel', f );

        var v = Object.values(f.features)[0];
        var featureName = `${v.featureName} (${v.dataType})`;

        var $html = $(`
            <div class="feature-panel">
              <div class="feature-panel__main">
                <div class="feature-panel__header">
                  <div class="feature-panel__close-icon fas fa-times"></div>
                </div>
                <div class="feature-panel__content">
                  <div class="feature-heading">
                    <i class="feature-heading__icon far fa-star"></i>
                    <span class="feature-heading__name">${featureName}</span>
                  </div>
                  ${ f.status.state === 'built'
                     ? `<div class="feature-operations">
                        ${  user.admin === true
                            ? `${ f.batch === 'paused'
                                  ?  `<span class="feature-operations__operation">
                                        <i class="feature-operations__icon far fa-play-circle"></i>
                                        <span class="feature-operations__name item action"
                                              value="${f.jobID}" 
                                              zone="${zone}" 
                                              action="resume"
                                              id="resume">Resume</span>
                                    </span>`

                                  : `<span class="feature-operations__operation">
                                        <i class="feature-operations__icon far fa-pause-circle"></i>
                                        <span class="feature-operations__name item action" 
                                              value="${f.jobID}" 
                                              zone="${zone}"
                                              action="pause"
                                              id="pause">Pause</span>
                                    </span>`
                               }`

                            : ``
                        }
                        ${  zone === 'lab'
                            ?  `${  f.markedForPromotion 
                                        && f.markedForPromotion.flag === true  
                                        && !( f.markedForDecommission && f.markedForDecommission.flag === true )

                                    ?  `<span class="feature-operations__operation feature-operations__operation--disabled">
                                            <i class="feature-operations__icon far fa-meh-blank"></i>
                                            <span class="feature-operations__name" 
                                                  value="${f.jobID}" 
                                                  zone="${zone}" 
                                                  action="unmark" 
                                                  id="promoteJob"
                                                  disabled>Unmark promomtion</span>
                                        </span>`

                                    :   `<span class="feature-operations__operation">
                                            <i class="feature-operations__icon far fa-arrow-alt-circle-up"></i>
                                            <span class="feature-operations__name item action" 
                                                  value="${f.jobID}" 
                                                  zone="${zone}" 
                                                  action="mark"
                                                  id="promoteJob">Mark for promomtion</span>
                                        </span>`
                                }
                                ${  f.markedForDecommission 
                                        && f.markedForDecommission.flag == true 
                                        && user.admin == true

                                    ?   `<span class="feature-operations__operation">
                                            <i class="feature-operations__icon fas fa-ban"></i>
                                            <span class="feature-operations__name item action" 
                                                  value="${f.jobID}"
                                                  zone="${zone}"
                                                  action="decommission"
                                                  id="decommissionJob">Decommission</span>
                                        </span>`

                                    : `` 
                                }
                                ${ f.markedForDecommission && f.markedForDecommission.flag === true

                                    ?  `<span class="feature-operations__operation">
                                            <i class="feature-operations__icon far fa-meh"></i>
                                            <span class="feature-operations__name item action"
                                                  value="${f.jobID}"
                                                  zone="${zone}"
                                                  action="unmark"
                                                  id="decommissionJob">Unmark decommission</span>
                                        </span>`

                                    :  `<span class="feature-operations__operation">
                                            <i class="feature-operations__icon far fa-arrow-alt-circle-down"></i>
                                            <span class="feature-operations__name item action"
                                                  value="${f.jobID}"
                                                  zone="${zone}"
                                                  action="mark"
                                                  id="decommissionJob">Mark for decommission</span>
                                        </span>`
                                }`

                            : ``
                        }
                        </div>
                    `
                    : ''
                  }
                  <div class="feature-details">
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon far fa-id-card"></div>
                        <div class="feature-details__name">Job ID</div>
                      </div>
                      <div class="feature-details__content">${f.jobID}</div>
                    </div>
                    ${ f.batch 
                        ? `<div class="feature-details__row">
                              <div class="feature-details__title">
                                <div class="feature-details__icon fas fa-sort-numeric-up"></div>
                                <div class="feature-details__name">Batch Status</div>
                              </div>
                              <div class="feature-details__content">${cap(f.batch)}</div>
                            </div>`
                        : ''
                    }
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon fas fa-battery-three-quarters"></div>
                        <div class="feature-details__name">State</div>
                      </div>
                      <div class="feature-details__content">${cap(f.status.state)}</div>
                    </div>
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon far fa-calendar-plus"></div>
                        <div class="feature-details__name">Created at</div>
                      </div>
                      <div class="feature-details__content">${f.createdAt}</div>
                    </div>
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon fab fa-amilia"></div>
                        <div class="feature-details__name">Script Language</div>
                      </div>
                      <div class="feature-details__content">${f.scriptLanguage}</div>
                    </div>
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon far fa-calendar-check"></div>
                        <div class="feature-details__name">Updated at</div>
                      </div>
                      <div class="feature-details__content">${f.updatedAt}</div>
                    </div>
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon fas fa-shopping-cart"></div>
                        <div class="feature-details__name">Feature Store</div>
                      </div>
                      <div class="feature-details__content">${f.featureStore}</div>
                    </div>
                    ${ f.predictive && f.predictive.timeDate && f.predictive.targetFeature
                        ? `<div class="feature-details__row">
                          <div class="feature-details__title">
                            <i class="feature-details__icon fas fa-glasses"></i>
                            <span class="feature-details__name">Predictive Job</span>
                          </div>
                          <div class="feature-details__content">
                          ${ Object.keys( f.predictive.timeDate ).map( k => `
                                  <div class="predictive-job__row">
                                      <span class="predictive-job__title">Date</span>
                                      <span class="predictive-job__content">${f.predictive.timeDate[k]}</span>
                                  </div>
                             `).join( '' )
                          }
                          ${ Object.keys( f.predictive.targetFeature ).map( k => `
                                  <div class="predictive-job__row">
                                      <span class="predictive-job__title">${cap(k)}</span>
                                      <span class="predictive-job__content">${f.predictive.targetFeature[k]}</span>
                                  </div>
                             `).join( '' )
                          }
                          </div>
                        </div>`
                        : ``
                    }
                    ${ f.historyBatch 
                        ? `<div class="feature-details__row">
                              <div class="feature-details__title">
                                <div class="feature-details__icon fas fa-history"></div>
                                <div class="feature-details__name">Historical Batch Status</div>
                              </div>
                              <div class="feature-details__content">${cap(f.historyBatch)}</div>
                            </div>`
                        : ``
                    }
                    ${ f.fromDate
                        ? `<div class="feature-details__row">
                              <div class="feature-details__title">
                                <div class="feature-details__icon far fa-calendar-minus"></div>
                                <div class="feature-details__name">Historical Date (from date)</div>
                              </div>
                              <div class="feature-details__content">${f.fromDate}</div>
                           </div>`
                        : ``
                    }
                  </div>
                </div>
              </div>
            </div>
        `)
        
        var $featureHeading = $( '.feature-heading', $html );
        var $featureDetails = $( '.feature-details', $html );

        var $info = $(`

            <div class="feature-info">
                <div class="feature-info__icon far fa-bell"></div>
                <div class="feature-info__content"></div>
            </div>
        `);

        if ( f.markedForPromotion && f.markedForPromotion.flag === true ) {

            var $info = $(`

                <div class="feature-info">
                    <div class="feature-info__icon far fa-bell"></div>
                    <div class="feature-info__content"></div>
                </div>
            `);

            $( '.feature-info__content', $info ).text( 'This feature is marked for promotion.' );
            $featureHeading.after( $info );
        }

        if ( f.markedForDecommission && f.markedForDecommission.flag === true ) {

            var $info = $(`

                <div class="feature-info">
                    <div class="feature-info__icon far fa-bell"></div>
                    <div class="feature-info__content"></div>
                </div>
            `);

            $( '.feature-info__content', $info ).text( 'This feature is marked for decommission.' );
            $featureHeading.after( $info );
        }

        var $externalDependenciesRow = $( `

            <div class="feature-details__row">
              <div class="feature-details__title">
                <div class="feature-details__icon fas fa-database"></div>
                <div class="feature-details__name">External Data Source Dependencies</div>
              </div>
              <div class="feature-details__content">
                  <div class="external-dependencies"></div>
              </div>
            </div>
        `);

        var $externalDependencies = $( '.external-dependencies', $externalDependenciesRow );

        if ( f.dataSources && Object.keys( f.dataSources ).length ) {

            for ( var eachDataSource in f.dataSources ) {

                var $row = $createDependenciesRow( 'Source', 'fas fa-book', eachDataSource );
                $externalDependencies.append( $row );

                for ( eachOrigin in f.dataSources[eachDataSource] ) {

                    var $row = $createDependenciesRow( 'Origin', 'fas fa-cross', eachOrigin );
                    $externalDependencies.append( $row );

                    var $rowOfTables = $( `
                        <div class="external-dependencies__row">
                            <div class="external-dependencies__title">Tables</div>
                            <div class="external-dependencies__content"></div>
                        </div>
                    `);

                    for ( eachTable in f.dataSources[eachDataSource][eachOrigin] ) {

                        var $item = $( '<div class="external-dependencies__item">' );
                        var $icon = $( `<div class="external-dependencies__icon fas fa-table">` );
                        var $name = $( '<div class="external-dependencies__name">').text( eachTable );

                        $item.append( $icon, $name );

                        $( '.external-dependencies__content', $rowOfTables ).append( $item );
                    }

                    $externalDependencies.append( $rowOfTables );
                }
            }

            $featureDetails.append( $externalDependenciesRow );
        }

        function $createDependenciesRow( title, iconClass, name, prefix='external' ) {

            var $row = $( `<div class="${prefix}-dependencies__row">` );
            var $title = $( `<div class="${prefix}-dependencies__title">` ).text( title );
            var $content = $( `<div class="${prefix}-dependencies__content">` );
            var $item = $( `<div class="${prefix}-dependencies__item">` );
            var $icon = $( `<div class="${prefix}-dependencies__icon ${iconClass}">` );
            var $name = $( `<div class="${prefix}-dependencies__name">`).text( name );

            $item.append( $icon, $name );
            $row.append( $title, $content.append( $item ) );

            return $row;
        }

        var $featureDependenciesRow = $( `

            <div class="feature-details__row">
              <div class="feature-details__title">
                <div class="feature-details__icon fas fa-database"></div>
                <div class="feature-details__name">Feature(Choc-BERI) Dependencies</div>
              </div>
              <div class="feature-details__content">
                  <div class="feature-dependencies"></div>
              </div>
            </div>
        `);

        var $featureDependencies = $( '.feature-dependencies', $featureDependenciesRow );

        /** 
         * Example
            .feature-dependencies
                .feature-dependencies__row
                    .feature-dependencies__title Feature Stores
                    .feature-dependencies__content 
                        .feature-dependencies__item
                            i.feature-dependencies__icon.fas.fa-shopping-cart
                            span.feature-dependencies__name fixedservice
                .feature-dependencies__row
                    .feature-dependencies__title Features
                    .feature-dependencies__content 
                        .feature-dependencies__item
                            i.feature-dependencies__icon.far.fa-star
                            span.feature-dependencies__name fixedservice.recd_del_flg_bin
                        .feature-dependencies__item
                            i.feature-dependencies__icon.far.fa-star
                            span.feature-dependencies__name fixedservice.recd_del_flg
        */
        if ( f.dependencies && Object.keys( f.dependencies ).length ) {

            for ( var featureStoreName in f.dependencies ) {

                var $row = $createDependenciesRow( 'Feature Store', 'fas fa-shopping-cart', featureStoreName, 'feature' );
                $featureDependencies.append( $row );

                var $rowOfFeatures = $( `
                    <div class="feature-dependencies__row">
                        <div class="feature-dependencies__title">Features</div>
                        <div class="feature-dependencies__content"></div>
                    </div>
                `);

                var $featureDependenciesContent = $( '.feature-dependencies__content', $rowOfFeatures );

                for ( featureName in f.dependencies[featureStoreName].features ) {

                    var $item = $( '<div class="feature-dependencies__item">' );
                    var $icon = $( '<i class="feature-dependencies__icon far fa-star">' );
                    var $name = $( '<span class="feature-dependencies__name">' ).text( featureName );

                    $item.append( $icon, $name );
                    $featureDependenciesContent.append( $item );
                }

                $featureDependencies.append( $rowOfFeatures );
            }

            $featureDetails.append( $featureDependenciesRow );
        }

        var $failureRow = $( `

            <div class="feature-details__row feature-details__row--failure">
              <div class="feature-details__title">
                <div class="feature-details__icon fas fa-exclamation-circle"></div>
                <div class="feature-details__name">Failure Message</div>
              </div>
              <div class="feature-details__content"></div>
            </div>
        `);

        if ( f.status && f.status.state === 'failed' ) {

            $( '.feature-details__content', $failureRow ).text( f.status.message );
            $featureDetails.append( $failureRow );
        }

        $( '.feature-panel__close-icon', $html ).click( function () { 

            $featureNameClicked = null;
            $html.remove();
        } );
    
        return $html;
    }


/* ACE Code editor ********************************************************************************/
    
    try {
        
        var editor = ace.edit( 'code-editor' );
        var fontSize = 14;
        
        editor.setTheme( 'ace/theme/kuroir' );
        editor.setFontSize( fontSize );
        editor.session.setMode( 'ace/mode/sql' );

        $( '.editor__icon--full-screen' ).click( function () { 

            $( '.editor__main' ).get( 0 ).requestFullscreen();
        } );

        $( '.editor__icon--increase-font-size' ).click( function () { 

            editor.setFontSize( ++ fontSize );
        } );

        $( '.editor__icon--decrease-font-size' ).click( function () { 

            editor.setFontSize( -- fontSize );
        } );
    }
    catch ( error ) {

        console.warn( "[Choc] " + error );
    }

/* Splitter ***************************************************************************************/
    
    var startPosition = { x: undefined, y: undefined };
    var shouldStartSplit = false;
    var distanceX = 0;
    var $leftPanel = null;
    var $rightPanel = null;
    var $splitterContainer = $( '.splitter' );
    var currentWidth = 0;
    var $container = $( '.container' );
    
    $( '.splitter__handle', $splitterContainer ).mousedown( function ( event ) {

        startPosition.x = event.pageX;
        startPosition.y = event.pageY;

        $leftPanel = $splitterContainer.prev();
        $rightPanel = $splitterContainer.next();
        currentWidth = parseFloat( window.getComputedStyle( $rightPanel.get(0) ).width );

        shouldStartSplit = true;
    } );

    $( document ).mousemove( function ( event ) { 

        if ( shouldStartSplit === false || $leftPanel === null || $rightPanel === null ) {

            return;
        }

        distanceX = event.pageX - startPosition.x;
        $rightPanel.width( currentWidth - distanceX );
        $container.addClass( 'container--split' );
    } );

    $( document ).mouseup( function ( event ) { 

        shouldStartSplit = false;
        $container.removeClass( 'container--split' );

    } );

/* Semantic UI - customized ***********************************************************************/

    var data = {
      "dataSources": {
        "glue": {
          "idv": {
            "s_octf_nbn_srvc": {
              "database": "idv",
              "name": "s_octf_nbn_srvc",
              "service": "glue",
              "entity": "entity"
            }
          }
        }
      },
      "dependencies": {},
      "features": {
        "sp1": {
          "featureName": "sp1",
          "dataType": "TINYINT"
        }
      },
      "featureStore": "fixedservice",
      "scriptLanguage": "SQL",
      "feature_input": "select u.srvc_bk, service_provider as sp1\nfrom s_octf_nbn_srvc u\ninner join\n(select srvc_bk from s_octf_nbn_srvc\n group by srvc_bk having count(srvc_bk)=1) uniquenames\non uniquenames.srvc_bk = u.srvc_bk ",
      "jobID": "15526284243337060",
      "jobOutcome": "success",
      "entity": "srvc_bk"
    }

/* Create feature store ***************************************************************************/

    $( '#validate-code', '.main__content--create-feature-store' ).click( function () { 

        showValidateSuccessModal( data, function () {

            showCreateJobSuccessModal( 'fixedservice', 1234567890 ); 
        } );
    } );

/* Upload scripts *********************************************************************************/

    var $containerUploadScripts = $( '.main__content--upload-scripts' );
    var countOfFeatureFields = 1;
    var $containerOfFeatureFields = $( '.field-group__content', $containerUploadScripts );

    $( '.validate-button', $containerUploadScripts ).click( function () { 

        showValidateSuccessModal( data, function () {

            var header = "Job being created. Please wait ...";
            var content = "Job ID: " + Math.random().toString().slice(2);

            showCreateJobWaitModal( header, content ); 
        } );
    } );


    $( '.field-group__icon--add-feature' ).click( function () { 

        var $e = $createFeatureFields( ++ countOfFeatureFields );

        $containerOfFeatureFields.append( $e );

    } );

    $( '.field-group__icon--remove-feature' ).click( function () { 

        if ( countOfFeatureFields <= 1 ) {

            return;
        }

        $( '.field:last-child', $containerOfFeatureFields ).remove();
        countOfFeatureFields -- ;

    } );

    function $createFeatureFields( index ) {

        var $elem = $( `
            <div class="field">
              <div class="label field__title">Feature ${index}</div>
              <div class="field__content ui input labeled"><i class="ui label fas fa-star"></i>
                <input class="feature-name" type="text" name="feature-name-${index}" placeholder="Feature Name">
              </div>
              <div class="field__content ui fluid search dropdown selection">
                <input class="feature-data-type" type="hidden" name="feature-data-type-${index}"><i class="dropdown icon"></i>
                <input class="search" autocomplete="off" tabindex="0"><div class="default text">Data Type</div>
                <div class="menu" tabindex="-1">
                  <div class="item" data-value="TINYINT">TINYINT</div>
                  <div class="item" data-value="SMALLINT">SMALLINT</div>
                  <div class="item" data-value="TIMESTAMP">TIMESTAMP</div>
                  <div class="item" data-value="VARCHAR">VARCHAR</div>
                </div>
              </div>
            </div>
        `);

        $( '.ui.dropdown', $elem ).dropdown();

        return $elem;
    }

/* Browse files ***********************************************************************************/

    $( '.item--folder .item__icon' ).click( function () { 

        var $container = $( this ).parent();

        $container.toggleClass( 'item--folder--collapse' );
        $( '.content .list', $container ).toggle();

    } );

    $( '.item--folder .header' ).click( function () { 

        var $container = $( this ).parent().parent();

        $container.toggleClass( 'item--folder--collapse' );
        $( '.list', $container ).toggle();

    } );

/* PLACE LAST - Sementic UI ***********************************************************************/
    
    $( '.ui.dropdown' ).dropdown();


/* Upload files ***********************************************************************************/

    var $uploadingOverlay = $( '.uploading' );

    $( '.upload-files__submit' ).click( function () { 

        $uploadingOverlay.show();

    } );

    $( document ).keyup( function (event ) { 

        if ( event.key === 'Escape' && $uploadingOverlay.css( 'display' ) === 'block' ) {

            $uploadingOverlay.hide();
        }
    } )

} )();

/* Utils ******************************************************************************************/

function cap( str ) {

    var capped = str.charAt(0).toUpperCase() + str.slice(1);

    return capped.split(/(?=[A-Z])/).join( ' ' );
}

function createModal( className = '' ) {

    var $modal = $( `<div class="ui modal ${className}">` );
    var $header = $( '<div class="header">' );
    var $content = $( '<div class="content">');
    var $actions = $( '<div class="actions">' );
    var $closeButton = $( `
        <div class="ui cancel button">
            <i class="fa fa-times"></i>
            <span>Close<span>
        </div>
    ` );

    $modal.append( $header, $content, $actions );
    $actions.append( $closeButton );

    return {

        $modal,
        $header,
        $content,
        $actions,
        $closeButton
    }
}

function showErrorModal( headerContent="Error", contentContent="Something went wrong." ) {

    var modal = createModal( 'basic modal--error' );
    var $headerIcon = $( '<i class="far fa-times-circle">' );
    var $headerContent = $( `<div class="heading">${headerContent}</div>`);

    modal.$header.append( $headerIcon, $headerContent );
    modal.$content.text( contentContent );
    modal.$modal
         .modal( 'setting', 'transition', 'fade' )
         .modal( 'show' );
}

function showSuccessModal( headerContent="Success", contentContent="Done." ) {

    var modal = createModal( 'basic modal--success' );
    var $headerIcon = $( '<i class="far fa-check-circle">' );
    var $headerContent = $( `<div class="heading">${headerContent}</div>`);

    modal.$header.append( $headerIcon, $headerContent );
    modal.$content.text( contentContent );
    modal.$modal
         .modal( 'setting', 'transition', 'fade' )
         .modal( 'show' );

}

function showValidateSuccessModal( data = {}, onCreateJobButtonClick = () => {} ) {

    var modal = createModal( 'modal--validate-success' );
    var $metadataTag = $createTitle( 'fas fa-scroll', 'Metadata' );
    var $featureTag = $createTitle( 'far fa-star', 'Feature' );
    var $pre = $( '<pre>' );

    // Todo: handle creation of a feature.
    //
    // var $featureRow = $( '<div class="row">' ).append(

    //     $featureTag, 
    //     $( '<span class="row__content">Sp1</span>') 
    // );
    
    var $metadataRow = $( '<div class="row">' ).append( $metadataTag, $pre );
    var $jobIdRow = $( '<div id="job-id" class="row">' );

    var $createJobStatus = $( '<div class="create-job__status">' );
    var $createJobButton = $( `
        <div class="create-job__button yellow ui button">
            <i class="fas fa-hammer"></i>
            <span>Create Job</span>
        </div>
     ` );

    var $headerIcon = $( '<i class="far fa-smile">' );
    var $headerContent = $( '<span>' ).text( 'Code validation was successful' );

    $pre.text( JSON.stringify( data , null, 2 ) );

    $jobIdTitle = $createTitle( 'far fa-id-card', 'Job ID' );
    $jobIdContent = $( `<span class="row__content">${data.jobID}</span>` );

    $jobIdRow.append( $jobIdTitle, $jobIdContent );

    modal.$header.append( $headerIcon, $headerContent );
    modal.$content.append( /*$featureRow,*/ $metadataRow, $jobIdRow, $createJobStatus );
    modal.$actions.append( $createJobButton );
    modal.$modal.modal( 'show' );

    $createJobButton.click( function () { 

        onCreateJobButtonClick();
        
    } );
}

function $createTitle( iconClass = '', content = '' ) {

    return $( `
        <span class="title">
            <i class="title__icon ${iconClass}"></i>
            <span class="title__contnet">${content}</span>
        </span>
    ` );
}

function showCreateJobSuccessModal( featureStoreName, jobId ) {

    var modal = createModal( 'basic modal--create-job-success' );
    var $headerIcon = $( '<i class="far fa-check-circle">' );
    var $headerContent = $( `<div>A job <em>ID : ${jobId}</em> is added to create feature store <em>${featureStoreName}</em></div>`);

    modal.$header.append( $headerIcon, $headerContent );
    modal.$content.html( `
        Oompa loompa doompety doo<br>
        I'm getting BERI-ies ready for you<br>
        Oompa loompa doompety dee(t)<br>
        If your code is good<br>
        then it will complete<br>
    `);
    modal.$modal
         .modal('setting', 'transition', 'fade' )
         .modal( 'show' );
}

function showCreateJobWaitModal( headerContent, contentContent ) {

    var modal = createModal( 'basic modal--create-job-wait' );
    var $headerIcon = $( '<i class="far fa-hourglass">' );
    var $headerContent = $( `<div>${headerContent}</div>`);

    modal.$header.append( $headerIcon, $headerContent );
    modal.$content.text( contentContent );
    modal.$modal
         .modal('setting', 'transition', 'fade' )
         .modal( 'show' );
}

function showCreateJobStatusModal( { modalClass, iconClass, headerContent, contentContent } ) {

    // Todo: Create a base function of status of modal, eg. success, wait/pending, fail/error, etc
}

    
