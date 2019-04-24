console.log( 'Batch MGMT' );

console.log( 'batches', batches );

var data = {

    name: 'a',
    type: 'base',
    children: [
        { name: 'a1', value: 10, children: [ { name: 'a11', value: 3 } ] },
        { name: 'a2', value: 20 },
        { name: 'a3', value: 30 },
    ]
};

var b = {

    type: 'base',
    children: [

        { stage: '0', type: 'stage', children: [

                { jobId: '15538177824356391', type: 'job', _size: 10, runtime: `1'23"`, status: 'built' },
                { jobId: '15537490165215569', type: 'job', _size: 8, runtime: `4'56"`, status: 'waiting' },

                { featureStore: 'fixedservice', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'errored' }, 
                { featureStore: 'mobile', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'built' }, 
                { featureStore: 'services', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'building' }, 
        ] },
        { stage: '1', type: 'stage', children: [

                { jobId: '15538178472230601', type: 'job', _size: 1, runtime: `1'16"`, status: 'built' },
                { jobId: '15537490165215569', type: 'job', _size: 2, runtime: `2'16"`, status: 'failed' },
                { jobId: '15537490165215569', type: 'job', _size: 3, runtime: `3'16"`, status: 'errored' },
                { jobId: '15537490165215569', type: 'job', _size: 4, runtime: `4'16"`, status: 'building' }, 
                { jobId: '15537490165215569', type: 'job', _size: 8, runtime: `5'16"`, status: 'waiting' },
                { jobId: '15537490165215569', type: 'job', _size: 15, runtime: `6'16"`, status: 'aborted' },

                { featureStore: 'fixedservice', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'failed' }, 
                { featureStore: 'mobile', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'waiting' }, 
                { featureStore: 'services', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'paused' }, 

        ] },
        { stage: '2', type: 'stage', children: [
                { jobId: '15535557007171934', type: 'job', _size: 1, runtime: `7'16"`, status: 'paused' },
                { jobId: '38740494881083431', type: 'job', _size: 3, runtime: `8'16"`, status: 'promoting' },
                { jobId: '58749174104841739', type: 'job', _size: 5, runtime: `9'16"`, status: 'promoted' },
                { jobId: '58749174104841739', type: 'job', _size: 6, runtime: `10'16"`, status: 'decommissioning'},
                { jobId: '58749174104841739', type: 'job', _size: 7, runtime: `11'16"`, status: 'decommissioned' }, 
                { jobId: '58749174104841739', type: 'job', _size: 8, runtime: `12'16"`, status: 'built'},
                { featureStore: 'services', type: 'glooping', _size: 3, runtime: `4'56"`, status: 'unknown' }, 
        ] },
    ]
}

var root = d3.hierarchy( b ).sum( d => {

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

var g = d3.select( '#__batch__circles' )
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
      var circle = createCircle( { cx: d.x, cy: d.y, r: d.r } );

      g.classList.add( '__g' );
      circle.classList.add( '__g__circle' );
      g.append( circle );

      if ( d.data.type === 'stage' ) {

        g.classList.add( '__g--stage' );
        g.classList.add( '__g--stage-' + d.data.stage );

        var stageText = createText( 'STAGE ' + d.data.stage, { x: d.x, y: d.y - d.r + 15 } );

        stageText.classList.add( '__g__stage' );
        g.append( stageText );

      }
      else if ( d.data.type === 'job' ) {

        g.classList.add( '__g--job' );

        if ( d.data.status ) {

            g.classList.add( '__g--' + d.data.status );
        }

        var shortId = shortenId( d.data.jobId );
        var jobIdText = createText( shortId , { x: d.x, y: d.y - 5 } );
        jobIdText.classList.add( '__g__job-id');

        var runtimeContent = `${d.data.runtime} (${d.data._size})`;
        var runtimeText = createText( runtimeContent, { x: d.x, y: d.y + 5 } );
        runtimeText.classList.add( '__g__runtime' );

        var statusText = createText( shortenStatusText( d.data.status ), { x: d.x, y: d.y + 15 } );
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

        var featureStoreText = createText( d.data.featureStore, { x: d.x, y: d.y - 5 } );
        featureStoreText.classList.add( '__g__feature-store' );

        var runtimeContent = `${d.data.runtime}`;
        var runtimeText = createText( runtimeContent, { x: d.x, y: d.y + 5 } );
        runtimeText.classList.add( '__g__runtime' );

        var statusText = createText( shortenStatusText( d.data.status ), { x: d.x, y: d.y + 15 } );
        statusText.classList.add( '__g__status' );

        g.append( featureStoreText );
        g.append( runtimeText );
        g.append( statusText );

      }
      else if ( d.data.type === 'base' ) {

        g.classList.add( '__g--base' );
      }
      else {

        console.warn( '[Choc] Cirlce type not found.' );
      }

      return g;

   } );

var $jobDetails = null;

$( window ).resize( function () { 

    if ( $jobDetails ) {

        $jobDetails.remove();
    }

} );

$( document ).click( function ( event ) { 

    var $closest = $( event.target ).closest( '#__batch__circles' );

    if ( $closest.length === 0 && $jobDetails ) {

        $jobDetails.remove();
    }
} )

$( '#__batch__circles' )
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

        if ( $jobDetails ) {

            $jobDetails.remove();
        }

        if ( $circle.is( '.__g--job .__g__circle' ) ) {

            var rectOfJob = $circle.get(0).getBoundingClientRect();

            var x = rectOfJob.x + rectOfJob.width + 20;
            var y = rectOfJob.y + rectOfJob.height / 2 - 150 ;
            var job = createJobObject( dummyJob, dummyJobDetails );
            var $tooltip = $createJobTooltip( job );
            
            $jobDetails = $tooltip
                            .css( { position: 'absolute', left: x, top: y } )
                            .appendTo( 'body' );
        }

    } );


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
         "jobID":"15538178472230601",
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

function createJobObject( jobOfBatch, jobDetails ){

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
        <div class="__job">
            <div class="__job__header"></div>
            <div class="__job__content">
                <div class="__job__row">
                    <div class="__detail">
                        <div class="__detail__title">Job ID</div>
                        <div class="__detail__content">${job.jobID}</div>
                    </div>
                </div>
                <div class="__job__row">
                    <div class="__detail">
                        <div class="__detail__title">Time Elapsed</div>
                        <div class="__detail__content">${ shortenTime(job.time.run) }</div>
                    </div>
                </div>
                <div class="__job__row">
                    <div class="__detail">
                        <div class="__detail__title">Status</div>
                        <div class="__detail__content">${ cap(job.status.state) }</div>
                    </div>
                </div>
                <div class="__job__row">
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

function createCircle( attrs = {} ) {

    var circle = document.createElementNS( 'http://www.w3.org/2000/svg', 'circle' );
    var defaults = { cx: 100, cy: 100, r: 100 };
    var o = Object.assign( {}, defaults, attrs );

    for ( var prop in o ) {

        circle.setAttribute( prop, o[ prop ] );
    }

    return circle;
}

function createText( content = '', attrs = {} ) {

    var text = document.createElementNS( 'http://www.w3.org/2000/svg', 'text' );
    var defaults = { x: 100, y: 100, 'text-anchor': 'middle' };
    var o = Object.assign( {}, defaults, attrs );

    for ( var prop in o ) {

        text.setAttribute( prop, o[ prop ] );
    }

    text.textContent = content;

    return text;
}

