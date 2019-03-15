( function () {

/* Intended for globals ***************************************************************************/

    var $container = $( '.container' );

/* Mobile view toggle *****************************************************************************/

    var $mobileMenuButton = $( '.mobile-menu__button' );

    $mobileMenuButton.click( function () { 

        $container.toggleClass( 'container--mobile' );
    } );

/* Feature store header toggle ********************************************************************/
    
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

/* Feature store toggle, all fixedservices, mobile, etc *******************************************/

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

/* Toggle feature panel ***************************************************************************/

    var $main = $( '.main' );
    var $featurePanel = $( '.feature-panel' );

    $( '.feature-status__feature-name' ).click( function () { 

        $featurePanel.toggle();
    } );

    $( '.feature-panel__close-icon' ).click( function () { 

        $featurePanel.hide();
    } );

/* ACE Code editor ********************************************************************************/
    
    var editor = ace.edit( 'code-editor' );
    
    editor.setTheme( 'ace/theme/kuroir' );
    editor.session.setMode( 'ace/mode/javascript' );

    $( '.editor__icon--full-screen' ).click( function () { 

        $( '.editor__main' ).get( 0 ).requestFullscreen();
    } );

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

/* Sementic UI ************************************************************************************/
    
    $( '.ui.dropdown' ).dropdown();

/* Semantic UI - customized ***********************************************************************/

    function createModal() {

        let $modal = $( '<div class="ui modal">' );
        let $header = $( '<div class="header">' );
        let $content = $( '<div class="content">');
        let $actions = $( '<div class="actions">' );
        let $closeButton = $( '<div class="ui cancel button">Close</div>' );

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

    function showCreateJobSuccssModal( featureStoreName, responseData ) {

        let modal = createModal();

        modal.$header.text( `Success... Feature store - ${featureStoreName} is created.` );
        modal.$content.text( 'Job ID: ' + responseData );
        modal.$modal
             .modal('setting', 'transition', 'fade' )
             .modal( 'show' );
    }

    function showValidationSuccessModal( data ) {

        let modal = createModal();

        let $span = $( '<span>Metadata</span>' );
        let $pre = $( '<pre>' );
        let $jobId = $( '<div id="job-id">' );
        let $createJobStatus = $( '<div class="create-job__status">' );
        let $createJobButton = $( `
            <div class="create-job__button ui button">
                Create Job
            </div>
         ` );

        $pre.text( JSON.stringify( data , null, 2 ) );
        $jobId.text( `Job ID: ${data.jobID}` );

        modal.$header.text( 'Code validation has passed.' );
        modal.$content.append( $span, $pre, $jobId, $createJobStatus );
        modal.$actions.append( $createJobButton );
        modal.$modal.modal( 'show' );

        $createJobButton.click( () => { 

           $.post( '/executeScript/lab', { content: JSON.stringify( data ) } )
            .done( responseData => {

                if ( responseData.errorMessage ) {

                    showCreateJobFailModal( data.featureStore, responseData );
                }
                else {

                    showCreateJobSuccssModal( data.featureStore, responseData );
                }
             } );
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

    // showValidationSuccessModal( data );

/* Create feature store ***************************************************************************/

    $( '.validate-button' ).click( function () { 

        showValidationSuccessModal( data );
    } );

} )();