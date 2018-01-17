<script type="text/javascript">
			
			// define our scheduler class
			
			var sphex = sphex || {};
			sphex.Scheduler = {
				
				// event queue
				Events : [],
				
				// true if the scheduler is now processing events
				IsRunning : false,
				
				// add event (first in first out)
				Queue : function( e, t ) {
					if( !e || typeof(e) != "function" )
						throw "First argument to Scheduler.Queue must be a function";
					if( t == null || typeof(t) != "number" )
						throw "Second argument to Scheduler.Queue must be an integer";
					
					this.Events.push( [ e, t ] );
				},
				
				// execute queued events
				Run : function() {
					this.IsRunning = true;
					this.Next();
				},
				
				// execute next event
				Next : function() {
					// return if no events
					if( !this.Events || this.Events.length == 0 ) {
						this.IsRunning = false;
						if( this.OnComplete && typeof(this.OnComplete) == "function")
							this.OnComplete();
						return;
					}
					
					if( this.IsRunning ) {
						// get next event - first-in-first-out
						var o = this.Events[0]; // next event
						var e = o[0];
						var t = o[1];
						
						var self = this;
						setTimeout(
							function() {
								if( self.IsRunning ) {
									e();
									self.Events.shift(); // take event off queue
									self.Next();
								}
							},
							t
						);
					}
				},
				
				// empty event queue
				Clear : function() {
					this.Events = [];
				},
				
				// pause execution of scheduled events without emptying event queue
				Pause : function() {
					this.IsRunning = false;
				},
				
				// stop execution of scheduled events and emtpy event queue
				Stop : function() {
					this.Pause();
					this.Clear();
				},
				
				// optional callback when all events are processed
				OnComplete : null
			};
		
			// instantiate
		
			$(function(){
				
				queueEvents(); // add some events (below)
				
				// forward our OnComplete event to the scheduler
				sphex.Scheduler.OnComplete = function() {
					log( "no more events!" );
				};
			});
			
			function queueEvents() {
				// create some events to run at 0 sec, then 1 sec after,
				// then 2 sec after, etc
				
				var nEvents = 5;
				for( var i = 0; i < nEvents; i++ ) {
					var evt = function() {
						var local = i; // local to this scope
						return function() {
							log( "fire event " + local + " (" + local + " seconds since last event)" );
						};
					}();
					
					sphex.Scheduler.Queue( evt, i * 1000 );
				}
				
				log( nEvents + " events queued.");
			}
			
			function log( msg ) {
				$("#console").append(
					$("<p>", {text: msg} ) 
				);
				
				// scroll to bottom
				$("#console").scrollTop(
					$("#console").children().size() *
					$("#console").children(0).outerHeight()
				);
			};
		</script>
