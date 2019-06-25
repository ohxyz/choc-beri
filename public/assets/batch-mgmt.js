var dummyCircles = {

    type: 'base',
    children: [

        { stage: '0', type: 'stage', children: [

                { jobId: '15538177824356391', type: 'job', _size: 10, runtime: `1'23"`, status: 'built' },
                { featureStore: 'mobile', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'built' }, 
                { jobId: '15535557007171934', type: 'job', _size: 8, runtime: `4'56"`, status: 'waiting' },
                { featureStore: 'fixedservice', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'errored' }, 
                { featureStore: 'services', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'building' }, 
        ] },

        { stage: '1', type: 'stage', children: [

                { jobId: '15538178472230601', type: 'job', _size: 1, runtime: `1'16"`, status: 'built' },
                { jobId: '15535557007171934', type: 'job', _size: 2, runtime: `2'16"`, status: 'failed' },
                { jobId: '15535557007171934', type: 'job', _size: 3, runtime: `3'16"`, status: 'errored' },
                { featureStore: 'fixedservice', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'failed' }, 
                { jobId: '15535557007171934', type: 'job', _size: 4, runtime: `4'16"`, status: 'building' }, 
                { jobId: '15535557007171934', type: 'job', _size: 8, runtime: `5'16"`, status: 'waiting' },
                { jobId: '15535557007171934', type: 'job', _size: 15, runtime: `6'16"`, status: 'aborted' },
                { featureStore: 'mobile', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'waiting' }, 
                { featureStore: 'services', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'paused' }, 

        ] },

        { stage: '2', type: 'stage', children: [
                { jobId: '15535557007171934', type: 'job', _size: 1, runtime: `7'16"`, status: 'paused' },
                { jobId: '38740494881083431', type: 'job', _size: 3, runtime: `8'16"`, status: 'promoting' },
                { jobId: '15535557007171934', type: 'job', _size: 5, runtime: `9'16"`, status: 'promoted' },
                { jobId: '58749174104841739', type: 'job', _size: 6, runtime: `10'16"`, status: 'decommissioning'},
                { jobId: '58749174104841739', type: 'job', _size: 7, runtime: `11'16"`, status: 'decommissioned' }, 
                { jobId: '15535557007171934', type: 'job', _size: 8, runtime: `12'16"`, status: 'built'},
                { featureStore: 'services', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'unknown' }, 
        ] },
    ]
}

var dummyJob = {

    executionDate: "D20190329T1800",
    jobID: "15535557007171934",
    stage: "0",
    status: {state: "built"},
    time: {start: "2019-03-29T19:08:14.025Z", end: "2019-03-29T19:12:36.092Z", run: "262067", min: "4.367783333333334"},
    type: "job",
    updatedAt: "2019-03-29T19:39:34.929Z",
};

var dummyJobDetails = {
   "Items":[
      {
         "dependencies":{

         },
         "entity":"srvc_bk",
         "featureStore":"services",
         "scriptLanguage":"PYSPARK",
         "status":{
            "state":"built"
         },
         "createdAt":"2019-03-29T00:04:08.685628Z",
         "dataSources":{
            "glue":{
               "idv":{
                  "s_octf_nbn_srvc":{
                     "name":"s_octf_nbn_srvc",
                     "database":"idv",
                     "service":"glue",
                     "entity":"entity"
                  },
                  "s_octf_dsl_srvc":{
                     "name":"s_octf_dsl_srvc",
                     "database":"idv",
                     "service":"glue",
                     "entity":"entity"
                  }
               }
            }
         },
         "jobID":"15535557007171934",
         "features":{
            "SubscriberID":{
               "featureName":"SubscriberID",
               "dataType":"STRING"
            },
            "ServiceType":{
               "featureName":"ServiceType",
               "dataType":"STRING"
            }
         },
         "updatedAt":"2019-03-29T19:39:35.070Z",
         "dpuCount":"10",
         "batch":"built",
         "scriptLocation":{
            "bucket":"t00-choc-beri-application",
            "file":"scripts/lab/services/SubscriberID-ServiceType.py"
         }
      }
   ],
   "Count":1,
   "ScannedCount":11
}



/* Main *******************************************************************************************/

if ( $( '.container' ).data( 'env' ) === 'dev' ) {


    /* Google charts ******************************************************************************/

    google.charts.load('current', { 'packages': [ 'corechart', 'line'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

        var data = google.visualization.arrayToDataTable( [

          [ 'Date(UTC)', 'BATCH STATUS'],
          [ '12/01/19',  1, ],
          [ '13/01/19',  0, ],
          [ '14/01/19',  1, ],
          [ '15/01/19',  0, ],
          [ '16/01/19',  1, ]
        ] );

        var options = {

            backgroundColor: '#ffffff',
            fontSize: 10,
            legend: { 
                position: 'top'
            },
            curveType: 'function',
            chartArea: { width: '80%' },
            series: {
                0: { 
                    color: '#aaaaaa',
                    lineWidth: 1
                }
            }
        };

        var container = document.getElementById( '__batch__daily-chart' );
        var chart = new google.visualization.LineChart( container );

        chart.draw( data, options );
    }

    /* Circles ************************************************************************************/
    

    var stages = makeStages( dummyBatch1 );
    var zone = $( '.main__header' ).data( 'zone' );

    if ( zone === 'lab' ) {

        $( '.__batch__details' ).append( $createBatchSummary( dummyBatch1 ) );
        $( '.__batch__workflow' ).html( $createCirclesByStage( dummyCircles.children ) );
        // $( '.__batch__drawing' ).append( $createCirclesByStage( stages ) );

        applyToAllCircles( $( '.__stage__circle--job' ) );
    }
    else if ( zone === 'fac' ) {

        createSvgBatchCircles( dummyCircles, '#__batch__circles' );
    }
}

var $jobTooltip = null;

$( window ).resize( function () { 

    if ( $jobTooltip ) {

        $jobTooltip.remove();
    }

} );

$( '.__batch' ).scroll( function () { 

    if ( $jobTooltip ) {

        $jobTooltip.remove();
    }
} );

$( document ).click( function ( event ) { 

    var $closest = $( event.target ).closest( '.__batch__drawing' );

    if ( $closest.length === 0 && $jobTooltip ) {

        $jobTooltip.remove();
    }
} );


/* Functions **************************************************************************************/

function makeStages( batchContainer ) {

    var stages = [ undefined ];
    var jobIds = [];

    for ( var key in batchContainer ) {

        var item = batchContainer[ key ];

        if ( item.jobID && item.type === 'job' ) {

            jobIds.push( item.jobID );
        }
    }

    for ( var jobId of jobIds ) {

        var job = batchContainer[ jobId ];

        if ( job ) {

            var stageOfJob = job.stage;
            var jobObject = {

                jobId: jobId,
                type: 'job',
                runtime: shortenTime( job.time.run ),
                status: job.status.state
            }
            
            if ( stages[ stageOfJob ] && Array.isArray( stages[ stageOfJob ].children ) ) {

                stages[ stageOfJob ].children.push( jobObject )
            }
            else {

                var stage = {
                    
                    stage: stageOfJob, 
                    type: 'stage', 
                    children: [ jobObject ]
                }

                var featureStores  = batchContainer[ stageOfJob ].featureStores;

                for ( var fs in featureStores ) {

                    var glooping = {

                        featureStore: fs,
                        type: 'glooping',
                        runtime: shortenTime( featureStores[ fs ].time.run ),
                        status: featureStores[ fs ].status.state
                    };

                    stage.children.push( glooping );
                }

                stages[ stageOfJob ] = stage;
            }
        }
    }

    return stages;
}

function $createCirclesByStage( stages ) {

    var $batchStages = $( '<div class="__batch__stages">' );
    var isResized = false;

    for ( var eachStage of stages ) {

        var $strip = $createStageStrip( eachStage );

        $batchStages.append( $strip );
    }

    $( '.__batch__drawing' ).dblclick( function ( event ) { 

        var $target = $( event.target );
        var $circle = $target.closest( '.__stage__circle--job' );

        var parsedJob = $circle.data( 'job' );

        if ( !parsedJob ) {

            return;
        }

        if ( $circle.length >= 1 ) {

            restoreAllCircles( $circle );
            toggleCircleStyles( $circle );
        }

    } );

    return $batchStages;
}

function popupJobDetails( elem, job ) {

    var rectOfJob = elem.getBoundingClientRect();
    var x = rectOfJob.x + rectOfJob.width + 20;
    var y = rectOfJob.y + rectOfJob.height / 2 - 150 ;

    $jobTooltip = $createJobTooltip( job )
                    .css( { position: 'absolute', left: x, top: y } )
                    .appendTo( 'body' );
}

function restoreAllCircles( $exclude ) {

    $( '.__stage__circle' ).each( function ( index, circle ) {

        var $circle = $( circle );

        if ( $circle.is( $exclude ) ) {
            
            return;
        }

        var originalSize = circle.getAttribute( 'data-original-size' );

        if ( originalSize ) {

            restoreCircle( $circle, originalSize );
        }
    } )
}

function toggleCircleStyles( $circle, styles = { width: '250px', height: '250px' } ) {

    var originalSize = $circle.data( 'original-size' );
    var currentWidth = $circle.get(0).offsetWidth;

    if ( currentWidth === originalSize ) {

        enlargeCircle( $circle, styles );
    }
    else {

        restoreCircle( $circle, originalSize );
    }
}

function enlargeCircle( $circle, styles ) {

    var delay = 300;

    $( '.__job__basic', $circle ).fadeOut( delay );

    $circle.animate( styles, delay, function() {

        $( '.__job__more', $circle ).fadeIn();
    } );

}

function restoreCircle( $circle, size ) {

    var delay = 300;

    $circle.css( 'opacity', 1 );

    $( '.__job__more', $circle ).fadeOut( delay );

    $circle.animate( { width: size, height: size }, delay, function () { 

        $( '.__job__basic', $circle ).fadeIn( delay );
    } );
}

function $createStageStrip( stage ) {

    var $tmpl = $( ` 
        <div class="__stage">
            <div class="__stage__header">
                <div class="__item __item--stage">
                    <span class="__item__content">STAGE ${stage.stage}</span>
                </div>
                <div class="__item">
                    <span class="__item__label">JOBS</span>
                    <span class="__item__content">${stage.children.filter( child => child.type === 'job' ).length }</span>
                </div>
                <div class="__item">
                    <span class="__item__label">GLOOPINGS</span>
                    <span class="__item__content">${stage.children.filter( child => child.type === 'glooping' ).length }</span>
                </div>
            </div>
            <div class="__stage__content">

            ${
                stage.children.map( child => {

                    if ( child.type === 'job' ) {

                        return `
                            <div class="__stage__circle __stage__circle--job __job __stage__circle--${child.status}" data-job-id="${child.jobId}">
                                <div class="__job__basic">
                                    <div class="__job__id" title="${child.jobId}">${ shortenId(child.jobId) }</div>
                                    <div class="__job__runtime">
                                        <span>${ child.runtime }(<span class="__stage__count-of-features">0</span>)</span>
                                    </div>
                                    <div class="__job__status">${ shortenStatusText(child.status) }</div>
                                </div>
                                <div class="__job__more">
                                    
                                </div>
                            </div>
                        `;
                    }
                    else if ( child.type === 'glooping' ) {

                        return `
                            <div class="__stage__circle __stage__circle--glooping __stage__circle--${child.status} __glooping ">
                                <div class="__glooping__feature-store">${ child.featureStore }</div>
                                <div class="__glooping__runtime">${ child.runtime }</div>
                                <div class="__glooping__status">${ child.status }</div>
                            </div>
                        `;
                    }

                    return '';

                } ).join( '' )

            }
            </div>
        </div>
    ` );

    return $tmpl;
}


function applyToAllCircles( $circles ) {

    $circles.each( function ( index, circle ) {

        relateJobToCircle( { 

            circle: circle,
            jobDetails: dummyJobDetails,
        } );
    } );
}


function relateJobToCircle( { circle, jobDetails, ratio = 0.2 } ) {

    var jobId = circle.getAttribute( 'data-job-id' );
    var job = makeObjectOfJob( dummyJob, jobDetails );

    if ( job.jobID === jobId ) {

        var width = circle.offsetWidth;
        var countOfFeatures = job.features.length;
        var length = width * ( 1 + countOfFeatures * ratio );
        
        circle.setAttribute( 'data-job', JSON.stringify( job ) );

        $( '.__stage__count-of-features', circle ).text( countOfFeatures );

        circle.style.width = length + 'px';
        circle.style.height = length + 'px';
        circle.setAttribute( 'data-original-size', length );

        $( '.__job__more', circle ).append( $createJobDetails( job ) );

    }
    else {

        circle.setAttribute( 'data-original-size', circle.offsetWidth );
    }
}

function $createJobDetails( job ) {

    var $tmpl = $( `
        <div class="__job__details">
            <div class="__job__row __detail">
                <div class="__detail__content">Job ID : ${job.jobID}</div>
            </div>
            <div class="__job__row __detail">
                <div class="__detail__content">Runtime : ${ shortenTime(job.time.run) }</div>
            </div>
            <div class="__job__row __detail">
                <div class="__detail__content">Status : ${ job.status.state }</div>
            </div>
            <div class="__job__row __detail">
                <div class="__detail__content">
                    <div class="__detail__list">
                    ${ job.features.map( feature => `
                        
                        <div class="__detail__item">
                            <div class="__feature">
                                <i class="__feature__icon far fa-star"></i>
                                <span class="__feature__name">${feature}</span>
                            </div>
                        </div>` ).join( '' )
                    }
                    </div>
                </div>
            </div>
        </div>
    `);

    return $tmpl;
}

function createSvgBatchCircles( batchHierarchy, containerSelector ) {

    var root = d3.hierarchy( batchHierarchy ).sum( d => {

        return d._size + 1;
    } );

    var nodes = root.descendants();

    var width = 500;
    var height = 500;
    var circlePadding = 5;

    var pack = d3.pack()
                 .size( [ width, height ] )
                 .padding( circlePadding )
                 ( root );

    var viewBoxValue = `0 0 ${width} ${height}`;

    var g = d3.select( containerSelector )
              .attr( 'width', '100%' )
              .attr( 'height', '100%')
              .attr( 'viewBox', viewBoxValue )
              .attr( 'preserveAspectRatio', 'xMidYMin meet' )
              .append( 'g' );

    g .selectAll( 'circle' )
      .data( nodes )
      .enter()
      .append( ( d, i, nodes ) => {

          var g = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
          var circle = createSvgCircle( { cx: d.x, cy: d.y, r: d.r } );

          g.classList.add( '__g' );
          circle.classList.add( '__g__circle' );
          g.append( circle );

          if ( d.data.type === 'stage' ) {

            g.classList.add( '__g--stage' );
            g.classList.add( '__g--stage-' + d.data.stage );

            var stageText = createSvgText( 'STAGE ' + d.data.stage, { x: d.x, y: d.y - d.r + 15 } );

            stageText.classList.add( '__g__stage' );
            g.append( stageText );

          }
          else if ( d.data.type === 'job' ) {

            g.classList.add( '__g--job' );

            if ( d.data.status ) {

                g.classList.add( '__g--' + d.data.status );
            }

            var shortId = shortenId( d.data.jobId );
            var jobIdText = createSvgText( shortId , { x: d.x, y: d.y - 5 } );
            jobIdText.classList.add( '__g__job-id');

            var runtimeContent = `${d.data.runtime} (${d.data._size})`;
            var runtimeText = createSvgText( runtimeContent, { x: d.x, y: d.y + 5 } );
            runtimeText.classList.add( '__g__runtime' );

            var statusText = createSvgText( shortenStatusText( d.data.status ), { x: d.x, y: d.y + 15 } );
            statusText.classList.add( '__g__status' );

            g.append( jobIdText );
            g.append( runtimeText );
            g.append( statusText );

          }
          else if (d.data.type === 'glooping' ) {

            g.classList.add( '__g--glooping' );

            if ( d.data.status ) {

                g.classList.add( '__g--' + d.data.status );
            }

            var featureStoreText = createSvgText( d.data.featureStore, { x: d.x, y: d.y - 5 } );
            featureStoreText.classList.add( '__g__feature-store' );

            var runtimeContent = `${d.data.runtime}`;
            var runtimeText = createSvgText( runtimeContent, { x: d.x, y: d.y + 5 } );
            runtimeText.classList.add( '__g__runtime' );

            var statusText = createSvgText( shortenStatusText( d.data.status ), { x: d.x, y: d.y + 15 } );
            statusText.classList.add( '__g__status' );

            g.append( featureStoreText );
            g.append( runtimeText );
            g.append( statusText );

          }
          else if ( d.data.type === 'base' ) {

            g.classList.add( '__g--base' );
          }
          else {

            console.warn( '[Choc] Circle type not found.' );
          }

          return g;

       } );



    $( containerSelector )
        .mouseover( function () {

            var $target = $( event.target );
            var activeClass = '__g__circle--active';
            var selectors = '.__g--job .__g__circle';

            if ( $target.is( '.__g__job-id' ) || $target.is( '.__g__status ') || $target.is( '.__g__runtime' ) ) {

                return;
            }

            $( selectors, $( this ) ).removeClass( activeClass );

            if ( $target.is( selectors ) ) {

                $target.addClass( activeClass );
            }
        } )
        .click( function ( event ) { 

            var $target = $( event.target );
            var $circle = $target;

            if ( $target.is( '.__g__job-id' ) || $target.is( '.__g__status ') || $target.is( '.__g__runtime' ) ) {

                $circle = $target.siblings( '.__g__circle' );
            }

            if ( $jobTooltip ) {

                $jobTooltip.remove();
            }

            if ( $circle.is( '.__g--job .__g__circle' ) ) {

                var rectOfJob = $circle.get(0).getBoundingClientRect();

                var x = rectOfJob.x + rectOfJob.width + 20;
                var y = rectOfJob.y + rectOfJob.height / 2 - 150 ;
                var job = makeObjectOfJob( dummyJob, dummyJobDetails );
                var $tooltip = $createJobTooltip( job );
                
                $jobTooltip = $tooltip
                                .css( { position: 'absolute', left: x, top: y } )
                                .appendTo( 'body' );
            }

        } );
}

function makeObjectOfJob( jobOfBatch, jobDetails ){

    if ( !( jobOfBatch && jobDetails && jobDetails.Items && jobDetails.Items.length >= 1 ) ) {

        throw new Error( '[Choc] Invalid arguments of a job.' );
    }

    var job = Object.assign( {}, jobOfBatch );
    var features = jobDetails.Items[0].features;
    var featureStore = jobDetails.Items[0].featureStore;

    job.features = [];

    for ( var prop in features ) {

        job.features.push( featureStore + '.' + features[prop].featureName );
    }

    return job;
}


function $createJobTooltip( job ) {

    var $template = $( `
        <div class="__job-tooltip">
            <div class="__job-tooltip__header"></div>
            <div class="__job-tooltip__content">
                <div class="__job-tooltip__row">
                    <div class="__detail">
                        <div class="__detail__title">Job ID</div>
                        <div class="__detail__content">${job.jobID}</div>
                    </div>
                </div>
                <div class="__job-tooltip__row">
                    <div class="__detail">
                        <div class="__detail__title">Time Elapsed</div>
                        <div class="__detail__content">${ shortenTime(job.time.run) }</div>
                    </div>
                </div>
                <div class="__job-tooltip__row">
                    <div class="__detail">
                        <div class="__detail__title">Status</div>
                        <div class="__detail__content">${ cap(job.status.state) }</div>
                    </div>
                </div>
                <div class="__job-tooltip__row">
                    <div class="__detail">
                        <div class="__detail__title">Features</div>
                        <div class="__detail__content">
                            <div class="__detail__list">
                            ${ job.features.map( feature => `
                                
                                <div class="__detail__item">
                                    <div class="__feature">
                                        <i class="__feature__icon far fa-star"></i>
                                        <span class="__feature__name">${feature}</span>
                                    </div>
                                </div>` ).join( '' )
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);

    return $template;
}

function $createBatchSummary( batchContainer ) {

    var totalStages = 0;
    var batch = batchContainer.batch;

    for ( var i = 0; i < 100; i ++ ) {

        if ( batchContainer[ i ] ) {

            i ++;
            totalStages = i;
        }
        else {

            break;
        }
    }

    var $tmpl = $( `
      <div class="__batch__summary">
        <div class="__batch__row">
          <div class="__batch__title">Batch Status</div>
          <div class="__batch__content"> 
            <div class="__batch__status __batch__status--${batch.status.state}">${ batch.status.state }</div>
          </div>
        </div>
        <div class="__batch__row">
          <div class="__batch__title">Batch ID (Execution Date)</div>
          <div class="__batch__content"> 
            <div class="__batch__id">${batch.executionDate}</div>
          </div>
        </div>
        <div class="__batch__row">
          <div class="__batch__title">Total Stages</div>
          <div class="__batch__content">${totalStages}</div>
        </div>
        <div class="__batch__row">
          <div class="__batch__title">Total Jobs</div>
          <div class="__batch__content">${batch.jobs.length}</div>
        </div>
        <div class="__batch__row">
          <div class="__batch__title">Feature Stores</div>
          <div class="__batch__content">
          ${
              batch.featureStores.map( fs => `

                  <div class="__feature-store">
                    <i class="__feature-store__icon fas fa-shopping-cart"></i>
                    <span class="__feature-store__name">${fs}</span>
                  </div>

              ` ).join( '' )
          }
          </div>
        </div>
        <div class="__batch__row">
          <div class="__batch__title">Execution Details</div>
          <div class="__batch__content">
            <div class="__excution__list">
              <div class="__execution__item">
                <div class="__execution__title">
                  <i class="__execution__icon fas fa-stopwatch"></i>
                  <span class="__execution__name">Start at</span></div>
                <div class="__execution__description">${batch.time.start}</div>
              </div>
              <div class="__execution__item">
                <div class="__execution__title">
                  <i class="__execution__icon fas fa-flag-checkered"></i>
                  <span class="__execution__name">End at</span></div>
                <div class="__execution__description">${batch.time.end}</div>
              </div>
              <div class="__execution__item">
                <div class="__execution__title">
                  <i class="__execution__icon fas fa-running"></i>
                  <span class="__execution__name">Runtime (ms)</span></div>
                <div class="__execution__description">${ Intl.NumberFormat().format(batch.time.run) } ms</div>
              </div>
              <div class="__execution__item">
                <div class="__execution__title">
                  <i class="__execution__icon fas fa-walking"></i>
                  <span class="__execution__name">Runtime (min)</span>
                </div>
                <div class="__execution__description">${ shortenTime( batch.time.run ) }</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ` );

    return $tmpl;
}


function shortenTime( milliseconds ) {

    var seconds = ( milliseconds / 1000 ).toFixed();
    var minutes = Math.floor( seconds / 60 );
    var remains = seconds % 60;

    if ( minutes === 0 ) {

        return `${remains}"`;
    }
    else {

        return `${minutes}'${remains}"`;
    }
}


function shortenId( id ) {

    return id.slice( 0,3 ) + '...' + id.slice( -3 );
}


function shortenStatusText( status ) {

    if ( status === 'decommissioned' ) return "decomm'd";
    if ( status === 'decommissioning' ) return "decomm'ng";

    return status;
}

function createSvgCircle( attrs = {} ) {

    var circle = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
    var defaults = { cx: 100, cy: 100, r: 100 };
    var o = Object.assign( {}, defaults, attrs );

    for ( var prop in o ) {

        circle.setAttribute( prop, o[ prop ] );
    }

    return circle;
}


function createSvgText( content = '', attrs = {} ) {

    var text = document.createElementNS( 'http://www.w3.org/2000/svg', 'text' );
    var defaults = { x: 100, y: 100, 'text-anchor': 'middle' };
    var o = Object.assign( {}, defaults, attrs );

    for ( var prop in o ) {

        text.setAttribute( prop, o[ prop ] );
    }

    text.textContent = content;

    return text;
}