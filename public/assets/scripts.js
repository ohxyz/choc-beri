( function () {

/* Globals ****************************************************************************************/

    var $container = $( '.container' );
    var $main = $( '.main' );

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
    
    $( '.feature-status__header' ).click( function () {

        var $icon = $( '.feature-status__icon-expand', this );
        var $content = $( this ).next();

        if ( $icon.hasClass( 'fa-plus') ) {

            $icon.removeClass( 'fa-plus' ).addClass( 'fa-minus' );
            $content.show();
        }
        else if (  $icon.hasClass( 'fa-minus') ) {

            $icon.removeClass( 'fa-minus' ).addClass( 'fa-plus' );
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

    var $featureNameClicked = null;
    var $featurePanel = null;

    $( '.feature-status__feature-name' ).click( function () {

        if ( $featurePanel !== null ) {

            $featurePanel.remove();
        }
        
        if ( $( this ).is( $featureNameClicked ) ) {

            $featureNameClicked = null;
        }
        else {

            $featurePanel = $createFeaturePanel( feature );
            $( '.main__content--feature-status' ).append( $featurePanel );

            $featureNameClicked = $( this );
        }

    } );

    function $createFeaturePanel( f ) {

        console.log(f);

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
                    <div class="feature-heading__icon far fa-star"></div>
                    <div class="feature-heading__name">${featureName}</div>
                  </div>
                  <div class="feature-details">
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon fas fa-child"></div>
                        <div class="feature-details__name">Job ID</div>
                      </div>
                      <div class="feature-details__content">${f.jobID}</div>
                    </div>
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon fas fa-sort-numeric-up"></div>
                        <div class="feature-details__name">Job Status</div>
                      </div>
                      <div class="feature-details__content">${f.batch}</div>
                    </div>
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon fas fa-battery-three-quarters"></div>
                        <div class="feature-details__name">State</div>
                      </div>
                      <div class="feature-details__content">${f.status.state}</div>
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
                        <div class="feature-details__icon fas fa-database"></div>
                        <div class="feature-details__name">External Data Source Dependencies</div>
                      </div>
                      <div class="feature-details__content">
                        <div class="feature-dependencies">
                          <div class="feature-dependencies__row">
                            <div class="feature-dependencies__title">Source</div>
                            <div class="feature-dependencies__content"> 
                              <div class="feature-dependencies__item">
                                <div class="feature-dependencies__icon fas fa-book"></div>
                                <div class="feature-dependencies__name">glue</div>
                              </div>
                            </div>
                          </div>
                          <div class="feature-dependencies__row">
                            <div class="feature-dependencies__title">Origin</div>
                            <div class="feature-dependencies__content"> 
                              <div class="feature-dependencies__item">
                                <div class="feature-dependencies__icon fas fa-cross"></div>
                                <div class="feature-dependencies__name">idv</div>
                              </div>
                            </div>
                          </div>
                          <div class="feature-dependencies__row">
                            <div class="feature-dependencies__title">Tables</div>
                            <div class="feature-dependencies__content"> 
                              <div class="feature-dependencies__item">
                                <div class="feature-dependencies__icon fas fa-table"></div>
                                <div class="feature-dependencies__name">idv.s_octf_nbn_srvc</div>
                              </div>
                              <div class="feature-dependencies__item"> 
                                <div class="feature-dependencies__icon fas fa-table"></div>
                                <div class="feature-dependencies__name">idv.s_sfdc_cse</div>
                              </div>
                              <div class="feature-dependencies__item"> 
                                <div class="feature-dependencies__icon fas fa-table"></div>
                                <div class="feature-dependencies__name">idv.s_octf_dsl_srvc</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon fas fa-shopping-cart"></div>
                        <div class="feature-details__name">Feature Store</div>
                      </div>
                      <div class="feature-details__content">${f.featureStore}</div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
        `)

        var $info = $(`

            <div class="feature-info">
                <div class="feature-info__icon far fa-bell"></div>
                <div class="feature-info__content">The feature is marked for decommissioning.</div>
            </div>
        `);

        var $operations = $(`

            <div class="feature-operations">
                <span class="feature-operations__operation">
                    <i class="feature-operations__icon far fa-pause-circle"></i>
                    <span class="feature-operations__name">Pause</span>
                </span>
                <span class="feature-operations__operation">
                    <i class="feature-operations__icon far fa-play-circle"></i>
                    <span class="feature-operations__name">Resume</span>
                </span>
                <span class="feature-operations__operation">
                    <i class="feature-operations__icon far fa-grin-beam"></i>
                    <span class="feature-operations__name">Mark for promomtion</span>
                </span>
                <span class="feature-operations__operation">
                    <i class="feature-operations__icon far fa-frown-open"></i>
                    <span class="feature-operations__name">Unmark promomtion</span>
                </span>
                <span class="feature-operations__operation">
                    <i class="feature-operations__icon fas fa-ban"></i>
                    <span class="feature-operations__name">Decommission</span>
                </span>
                <span class="feature-operations__operation">
                    <i class="feature-operations__icon far fa-grin-beam-sweat"></i>
                    <span class="feature-operations__name">Unmark decommission</span>
                </span>
            </div>
        `)

        var $failure = $( `

            <div class="feature-details__row feature-details__row--failure">
              <div class="feature-details__title">
                <div class="feature-details__icon fas fa-exclamation-circle"></div>
                <div class="feature-details__name">Failure Message</div>
              </div>
              <div class="feature-details__content">Exception: Duplicates exist in the entity rows. Duplicate or incorrect data is created in the Feature Store. Entity count:466934!=466932</div>
            </div>
        `);

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
        editor.session.setMode( 'ace/mode/javascript' );

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

        console.log( "[It's OK] " + error );
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

    function $createTag( iconClass = '', content = '' ) {

        return $( `
            <span class="tag">
                <i class="tag__icon ${iconClass}"></i>
                <span class="tag__contnet">${content}</span>
            </span>
        ` );
    }

    function showCreateJobSuccessModal( featureStoreName, jobId ) {

        var modal = createModal( 'basic modal--create-job-success' );
        var $headerIcon = $( '<i class="far fa-check-circle">' );
        var $headerContent = $( `<div>Feature store <em>${featureStoreName}</em> created successfully</div>`);

        modal.$header.append( $headerIcon, $headerContent );
        modal.$content.text( 'Job ID: ' + jobId );
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

    function showValidateSuccessModal( data = {}, onCreateJobButtonClick = () => {} ) {

        var modal = createModal( 'modal--validate-success' );
        var $metadataTag = $createTag( 'fas fa-scroll', 'Metadata' );
        var $featureTag = $createTag( 'far fa-star', 'Feature' );
        var $pre = $( '<pre>' );

        var $featureRow = $( '<div class="row">' ).append(

            $featureTag, 
            $( '<span class="row__content">Sp1</span>') 
        );
        
        var $metadataRow = $( '<div class="row">' ).append( $metadataTag, $pre );
        var $jobIdRow = $( '<div id="job-id" class="row">' );

        var $createJobStatus = $( '<div class="create-job__status">' );
        var $createJobButton = $( `
            <div class="create-job__button ui button">
                <i class="fas fa-dumbbell"></i>
                <span>Create Job</span>
            </div>
         ` );

        var $headerIcon = $( '<i class="far fa-smile">' );
        var $headerContent = $( '<span>' ).text( 'Code validation was successful' );

        $pre.text( JSON.stringify( data , null, 2 ) );

        $jobIdTag = $createTag( 'far fa-id-card', 'Job ID' );
        $jobIdContent = $( `<span class="row__content">${data.jobID}</span>` );

        $jobIdRow.append( $jobIdTag, $jobIdContent );

        modal.$header.append( $headerIcon, $headerContent );
        modal.$content.append( $featureRow, $metadataRow, $jobIdRow, $createJobStatus );
        modal.$actions.append( $createJobButton );
        modal.$modal.modal( 'show' );

        $createJobButton.click( function () { 

            onCreateJobButtonClick();
            
        } );
    }

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

    $( '.validate-button', '.main__content--create-feature-store' ).click( function () { 

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

            var header = "You job is being created. Please wait ...";
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

    $( '.item__icon.dropdown' ).click( function () { 

        var $container = $( this ).parent();

        $container.toggleClass( 'item--folder--collapse' );
        $( '.content .list', $container ).toggle();

    } );

/* PLACE LAST - Sementic UI ***********************************************************************/
    
    $( '.ui.dropdown' ).dropdown();

} )();