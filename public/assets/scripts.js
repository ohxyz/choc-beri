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
    var env = $container.data( 'env' );

    window.globals = Object.assign( {}, window.globals, {

        $container,
        $main,
        zone,
        user,
        env
    } );

    var dummyValidatedResult = {

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
    };

/* Global jQuery AJAX handler *********************************************************************/

    $( document )
        .ajaxStart( function() {

            $( 'body' ).addClass( '__body--loading' );

        } )
        .ajaxComplete( function () {

            $( 'body' ).removeClass( '__body--loading' );
            
        } ) ;

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

    var autoRefreshActiveClass = 'auto-refresh--enable';

    if( sessionStorage.getItem( 'autoReload' ) === 'true' ) {

        $( '.auto-refresh' ).addClass( autoRefreshActiveClass );
    }

    $( '.auto-refresh' ).click( function () {

        var $this = $( this );

        if ( $this.hasClass( autoRefreshActiveClass ) ) {

            $this.removeClass( autoRefreshActiveClass );
            sessionStorage.setItem( 'autoReload', 'false' );

        }
        else {

            $this.addClass( autoRefreshActiveClass );
            sessionStorage.setItem( 'autoReload', 'true' );
        }
    } );

    setInterval( function() {

        if( sessionStorage.getItem('autoReload') === 'true' ) {
            
            location.reload();
        }

    }, 5000 );

/* Dashboard - Create env *************************************************************************/
    
    $( '#create-stack-button' ).click( function () { 

        var header = "Stack creation successful";
        var content = `Stack ID : arn:aws:cloudformation:ap-southeast-2:510000124683:stack/d00-choc-beri-d/5d2438f0-5b5a-11e9-9aac-0aefa55feeec`
        var subContent = `An email will be sent to you when the minions and the oompa loompas have finished their tasks in creating your Exploratory Environment!`
        showSuccessModal( header, content, subContent  );

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

/* Feature status - toggle filters of feature's status ********************************************/

    var $filtersOfFeatureStatus = $( '.feature-store__status-filter' );

    $filtersOfFeatureStatus.click( function () {

        var $filter = $( this );
        var $container = $filter.closest( '.feature-store' );
        var activeClass = 'feature-store__status-filter--active';
        var statusOfFilter = $filter.attr( 'title' ).toLowerCase();

        var $lists = $( '.feature-status', $container );
        var statusOfList = '';
        var highlightClass = 'feature-status--highlight';

        $lists.hide();

        if ( $filter.hasClass( activeClass ) === false ) {

            $container.find( $filtersOfFeatureStatus ).removeClass( activeClass );
            $filter.addClass( activeClass );

            $lists.each( function () {

                var $list = $( this );
                var statusOfList = $list.data( 'status' );

                if ( statusOfList === statusOfFilter ) {

                    $list.addClass( highlightClass ).show();
                }
                else {

                    $list.hide();
                }

            } );
        }
        else {

            $filter.removeClass( activeClass );
            $lists.removeClass( highlightClass ).show();
        }

        var countOfLists = $lists.length;
        var countOfHiddenLists = $( '.feature-status:hidden', $container ).length;
        var $message = $( '.feature-store__message', $container );

        if ( countOfLists === countOfHiddenLists ) {

            $message.show();
        }
        else {

            $message.hide();
        }

    } );

/* Feature status - Feature store toggle, all fixedservices, mobile, etc **************************/

    $( '.strip__feature-store-name' ).click( function () { 

        var $button = $( this );
        var text = $button.text();

        if ( text === 'all' ) {

            $( '.feature-store' ).show();
            $( '.feature-store__heading' ).show();
        }
        else {

            $( '.feature-store' ).hide();
            $( '.feature-store__heading' ).hide();
            $( '#' + text ).show();
        }
        
        $( '.strip__feature-store-name' ).removeClass( 'strip__feature-store-name--active' );
        $button.addClass( 'strip__feature-store-name--active' );
    } );

/* Feature status - Create featue panel ***********************************************************/

    var $featureNameClicked = null;
    var $featurePanel = null;

    $( '.feature-status__job' ).click( function () {

        var $elemClicked = $( this );
        var featureName = $( '.feature-status__feature-name', $elemClicked ).text();

        if ( $featurePanel !== null ) {

            $featurePanel.remove();
        }

        if ( $elemClicked.is( $featureNameClicked ) ) {

            $featureNameClicked = null;
        }
        else {

            var feat = $elemClicked.data( 'feature' );

            if ( feat !== undefined && Object.keys( feat ).length )  {

                $featurePanel = $createFeaturePanel( featureName, feat );
                $( '.main__content--feature-status' ).append( $featurePanel );
            }
            else {

                console.warn( '[Choc] Feature details are missing.' );
            }

            $featureNameClicked = $elemClicked;
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

    function $createFeaturePanel( fn, f ) {

        var featureName = fn;

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
                                            <i class="feature-operations__icon fas fa-undo"></i>
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
                    <div class="feature-details__row">
                      <div class="feature-details__title">
                        <div class="feature-details__icon fas fa-battery-three-quarters"></div>
                        <div class="feature-details__name">Feature Status</div>
                      </div>
                      <div class="feature-details__content">${cap(f.status.state)}</div>
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
        
        editor.setTheme( 'ace/theme/iplastic' );
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
    var currentWidth = 0;
    var $container = $( '.container' );
    var $splitterHandle = $( '.splitter__handle' );
    var splitterActiveClass = 'splitter__handle--active';
    
    $splitterHandle.mousedown( function ( event ) {

        startPosition.x = event.pageX;
        startPosition.y = event.pageY;

        var $splitterContainer = $( this ).parent();

        $leftPanel = $splitterContainer.prev();
        $rightPanel = $splitterContainer.next();

        currentWidth = parseFloat( window.getComputedStyle( $rightPanel.get(0) ).width );

        shouldStartSplit = true;
        $splitterHandle.addClass( splitterActiveClass );
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
        $splitterHandle.removeClass( splitterActiveClass );

    } );

/* Create feature store ***************************************************************************/
    
    if ( env === 'dev' ) {

        $( '#validate-code', '.main__content--create-feature-store' ).click( function () { 

            showValidateSuccessModal( dummyValidatedResult, function () {

                var $headerContent = $( 
                    `<div>A job <em>ID : 1234567890</em>` + 
                    `is added to create feature store <em>${dummyValidatedResult.featureStore}</em></div>`
                );
                showCreateJobSuccessModal( $headerContent );
            } );
        } );
    }


/* Create feature store & Upload scripts - Validate code ******************************************/

    if ( env === 'dev' ) {

        var $containerUploadScripts = $( '.main__content--upload-scripts' );
        var countOfFeatureFields = 1;
        var $containerOfFeatureFields = $( '.field-group__content', $containerUploadScripts );

        $( '.validate-button', $containerUploadScripts ).click( function () { 

            showValidateSuccessModal( dummyValidatedResult, function () {

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
    
    $( '.ui.form .ui.dropdown' ).dropdown();


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

/* Upload script LAB - Script language, cadences, etc *********************************************/

    if ( env === 'dev' ) {
     
        var $scriptLanguages = $( '.__multi-cadence__lang .strip__item' );
        var $cadenceContainer = $( '.__multi-cadence__cadence' );
        var $blockContainer = $( '.__multi-cadence__block' );
        var scriptName = '';
        var $uploadScripts = $( '.upload-scripts' );
        var isFirstTime = true;

        handleStripItemClick( $scriptLanguages, function ( $selected ) {

            var $contentOfCadences = $( '.strip__content', $cadenceContainer );

            $contentOfCadences.empty();
            resetUploadScripts( $blockContainer );

            scriptName = $selected.text().toLowerCase();  
            $contentOfCadences.append( $renderCadences );

        } );

        function resetUploadScripts( $container ) {

            var $contentOfBlocks = $( '.strip__content', $container );
            
            $contentOfBlocks.empty();
            $contentOfBlocks.append( '<i class="__multi-cadence__icon fas fa-question">' );

            if ( env === 'dev' ) {

                $( '.upload-scripts' ).removeClass( 'upload-scripts--active' );
            }
        }

        function handleStripItemClick( $stripItems, handleClick ) {

            $stripItems.click( function () { 

                var $itemSelected = $( this );
                var activeClass = 'strip__item--active';

                $stripItems.removeClass( activeClass );
                $itemSelected.addClass( activeClass );

                handleClick( $itemSelected );
            } );

            if ( isFirstTime ) {

                $stripItems.eq( 0 ).click();
            }

        }

        function $renderCadences() {

            var $template = $( `

                <div class="strip__content">
                    <span class="strip__item">5 mins</span>
                    <span class="strip__item">1 hr</span>
                    <span class="strip__item">24 hrs</span>
                </div>
            `);

            var $cadences = $( '.strip__item', $template );

            handleStripItemClick( $cadences, function () { 

                resetUploadScripts( $blockContainer );
                $renderBlocks();
            } );

            return $template;
        }

        function $renderBlocks() {

            var $template = $( `
                <div class="strip__content">
                    <span class="strip__item">Single</span>
                    <span class="strip__item">Multiple</span>
                </div>
            `);

            var $items = $( '.strip__item', $template );

            $( '.strip__content', $blockContainer ).replaceWith( $template );

            handleStripItemClick( $items, function () {

                $( '.upload-scripts' ).each( function ( index, container ) {

                    var $container = $( container );
                    var activeClassNameOfUploadScript = 'upload-scripts--active';

                    if ( scriptName === $container.data( 'script' ) ) {

                        $container.addClass( activeClassNameOfUploadScript );
                    }
                    else {

                        $container.removeClass( activeClassNameOfUploadScript );
                    }

                } );

            } );

            isFirstTime = false;
        }
    }

/* Upload script - Mojo ***************************************************************************/
    
    if ( env === 'dev' ) {

        var globals = globals || {};
        var $metricsForm = $( '#metrics-form' );

        globals.metricsComponent = createMetricsComponent( { modelName: 'Classification' } );

        $metricsForm.append( globals.metricsComponent.$elem );

        $( '#select-model-container' ).click( function () {

            globals.metricsComponent.$elem.remove();

            if ( $( '#select-classification' ).is(':checked') ) {

                globals.metricsComponent = createMetricsComponent( { modelName: 'Classification' } );
            }
            else if ( $( '#select-regression' ).is(':checked') ) {

                globals.metricsComponent = createMetricsComponent( { modelName: 'Regression' } );
            }

            $metricsForm.append( globals.metricsComponent.$elem );

        } );

        /**
         * Create a component that holds DOM elements, slider, inputs and etc
         */
        function createMetricsComponent( { modelName = 'Classification' } = {} ) {

            var metrics = {

                "Classification": {
                  "Accuracy": {
                    "description": "Model Accuracy (0.00-1.00 float)",
                    "input_pattern": "^(?:1(?:\\.0)?|[0-1](?:\\.\\d[0-9])?|0?\\.\\d{0,9})$"
                  },
                  "AUC": {
                    "description": "Area Under Curve (Numeric float)",
                    "input_pattern": "^(\\d{0,9}(\\.\\d{1,9})?|\\d[1-9](\\.00?)?)$"
                  },
                  "F1": {
                    "description": "Measure of a test's accuracy (0.00-1.00 float)",
                    "input_pattern": "^(?:1(?:\\.0)?|[0-1](?:\\.\\d[0-9])?|0?\\.\\d{0,9})$"
                  }
                },
                "Regression": {
                  "R2": {
                    "description": "Coefficient of Determination (0.00-1.00 float)",
                    "input_pattern": "^(?:1(?:\\.0)?|[0-1](?:\\.\\d[0-9])?|0?\\.\\d{0,9})$"
                  },
                  "MSE": {
                    "description": "Mean Square Error (0.00-1.00 float)",
                    "input_pattern": "^(?:1(?:\\.0)?|[0-1](?:\\.\\d[0-9])?|0?\\.\\d{0,9})$"
                  }
                },
                "Continuous": {
                  "R2": {
                    "description": "Coefficient of Determination"
                  },
                  "AUC": {
                    "description": "Area Under Curve"
                  },
                  "Accuracy": {
                    "description": "Model Accuracy"
                  }
                }
            };

            var $container = $( `
                <div class="metrics-container">
                    <div id="metricDates" class="metrics-dates">
                        <div class="strip heading">
                            <span class="strip__title">Date for Prediction</span>
                            <span class="strip__content"></span>
                        </div>
                        <div id="timeRange" class="time-range slider"></div>
                        <div class="range-result">
                            <div class="days">Days(s): 0</div>
                        </div>
                    </div>
                </div>
            ` );

            var $rangeContainer = $( `
                <span class="ui checkbox range-container">
                    <input id="range" type="checkbox" name="range">
                    <label for="range">Range</label>
                </span>
            ` );

            if ( modelName === 'Classification' ) {

                $( '.strip__content', $container ).append( $rangeContainer );
            }

            var $range = $( '#range', $rangeContainer  );
            var $modelMetricsForm = $createModelMetricsForm( metrics[ modelName ] );
            var slider = createSimpleSlider( $container );

            $container.append( $modelMetricsForm );

            $range.change( function ()  {

                slider.noUiSlider.destroy();

                if ( $( this ).is( ':checked' ) ) {
                    slider = createRangeSlider( $container );
                }
                else {
                    slider = createSimpleSlider( $container );
                }

            } );

            return {

                $elem: $container,
                slider: slider,
                modelName: modelName.toLowerCase(),
                $getFields: function () { return $container.find( 'input[type="text"]' ); },
                $modelMetricsForm: $modelMetricsForm,
            };
        }

        function $createModelMetricsForm( data ) {

            var $form = $( `
                <form id="statistics" class="metrics-statistics">
                </form>
            ` );

            for ( var eachProp in data ) {

                var eachField = data[ eachProp ];
                var $field = $( '<div class="ui labeled input">' );
                var $label = $( '<div class="ui label">');
                var $input = $( '<input type="text" class="ui fluid">' );

                $label.text( eachProp ).attr( 'data-content', eachField.description );

                $input.attr( {

                    name: eachProp,
                    title: eachField.description,
                    pattern: eachField.input_pattern
                } );

                $field.append( $label, $input );
                $form.append( $field );
            }

            return $form;
        }

        /**
         * @returns DOM element of slider
         */
        function createSimpleSlider( $container ) {

            var $days = $( '.days', $container );
            var slider = $( '.slider', $container ).get( 0 );

            noUiSlider.create( slider, {

                start: 1,
                connect: true,
                margin: 15,
                step: 1,
                orientation: 'horizontal',
                range: {
                    'min': 1,
                    'max': 100
                }
            } );

            slider.noUiSlider.on( 'update',  function ( values ) {

                var days = parseInt( values );
                $days.text( `Day(s): ${days}`);

            } );

            return slider;
        }


        /**
         * @returns DOM element of slider
         */
        function createRangeSlider( $container ) {

            var $days = $( '.days', $container );
            var slider = $( '.slider', $container ).get( 0 );

            noUiSlider.create( slider, {

                start: [ 1, 80 ],
                connect: true,
                step: 1,
                orientation: 'horizontal',
                range: {
                    'min': 1,
                    'max': 100
                }
            } );

            slider.noUiSlider.on( 'update',  function ( values ) {

                var min = parseInt( values[ 0 ] );
                var max = parseInt( values[ 1 ] );

                $days.text( `Day(s): ${min} - ${max}`);

            } );

            return slider;
        }
    }
    
} )();

/* Utils ******************************************************************************************/

function cap( str ) {

    var capped = str.charAt(0).toUpperCase() + str.slice(1);

    return capped.split(/(?=[A-Z])/).join( ' ' );
}

/* Utils - Semantic UI - customized ***************************************************************/

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
    $modal.modal( { closable: false } );

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

    return modal.$modal
                .modal( 'setting', 'transition', 'fade' )
                .modal( 'show' );
}

function showSuccessModal( headerContent="Success", contentContent="Done.", subContent="" ) {

    var modal = createModal( 'basic modal--success' );
    var $headerIcon = $( '<i class="far fa-check-circle">' );
    var $headerContent = $( `<div class="heading">${headerContent}</div>`);

    modal.$header.append( $headerIcon, $headerContent );
    modal.$content.append( $( '<div class="content__main">' ).append( contentContent ) );

    if ( subContent !== '' ) {

        var $sub = $( '<div class="content__sub">' ).append( subContent );

        modal.$content.append( $sub );
    }
    
    return modal.$modal
                .modal( 'setting', 'transition', 'fade' )
                .modal( 'show' );

}

function showValidateSuccessModal( data = {}, onCreateJobButtonClick = () => {} ) {

    var modal = createModal( 'modal--validate-success' );
    var $metadataTag = $createTitle( 'fas fa-scroll', 'Metadata' );
    var $featureTag = $createTitle( 'far fa-star', 'Feature' );
    var $pre = $( '<pre>' );

    var $metadataRow = $( '<div class="row">' ).append( $metadataTag, $pre );
    var $jobIdRow = $( '<div class="job-id row">' );

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
    $jobIdContent = $( `<span class="job-id__content">${data.jobID}</span>` );

    $jobIdRow.append( $jobIdTitle, $jobIdContent );

    modal.$header.append( $headerIcon, $headerContent );
    modal.$content.append( $metadataRow, $jobIdRow, $createJobStatus );
    modal.$actions.append( $createJobButton );
    modal.$modal.modal( 'show' );

    $createJobButton.click( function () { 

        onCreateJobButtonClick();
        
    } );
}

function $createTitle( iconClass = '', content = '' ) {

    return $( `
        <span class="a-title">
            <i class="a-title__icon ${iconClass}"></i>
            <span class="a-title__content">${content}</span>
        </span>
    ` );
}

function showCreateJobSuccessModal( $headerContent ) {

    var modal = createModal( 'basic modal--create-job-success' );
    var $headerIcon = $( '<i class="far fa-check-circle">' );
    
    modal.$header.append( $headerIcon, $headerContent );
    modal.$content.html( `
        Oompa loompa doompety doo<br>
        I'm getting BERI-ies ready for you<br>
        Oompa loompa doompety dee(t)<br>
        If your code is good<br>
        then it will complete<br>
    `);
    modal.$modal
         .modal( 'setting', 'transition', 'fade' )
         .modal( 'show' );
}

function showCreateJobWaitModal( headerContent, contentContent ) {

    var modal = createModal( 'basic modal--create-job-wait' );
    var $headerIcon = $( '<i class="far fa-hourglass">' );
    var $headerContent = $( `<div>${headerContent}</div>`);

    modal.$header.append( $headerIcon, $headerContent );
    modal.$content.text( contentContent );
    modal.$modal
         .modal( 'setting', 'transition', 'fade' )
         .modal( 'show' );
}

function showCreateJobStatusModal( { modalClass, iconClass, headerContent, contentContent } ) {

    // Todo: Create a base function of status of modal, eg. success, wait/pending, fail/error, etc
}
