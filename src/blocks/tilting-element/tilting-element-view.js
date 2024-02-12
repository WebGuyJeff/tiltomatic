import { gsap } from "gsap"

/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

gsap.ticker.fps( 30 ) // Limit updates for smoother animation.

const config = {
	containerSelector: '.tilt_container',
	childSelector:     '.tilt',
	maxAngleX:         50,
	maxAngleY:         50,
	perspective:       '200px'
}


/**
 * Get tilt container ancestor.
 */
const getContainer = ( child ) => child.closest( config.containerSelector ) || false


/**
 * Debounce
 * 
 * Only execute last function call after a wait time. When additional calls are made before the
 * timer expires, the final call is stored overwriting the previously stored call, and the countdown
 * timer restarts.
 */
let timeout
const debounce = ( fn, wait, args = [] ) => {
	clearTimeout( timeout )
	timeout = setTimeout( () => fn( ...args ), wait )
}


/**
 * Throttle
 * 
 * Deny further function calls until wait time has passed since last call. Any calls made before the
 * timer expires are discarded.
 */
let isThrottled = false
const throttle = ( fn, wait, args = [] ) => {
	if ( isThrottled ) return
	isThrottled = true
	setTimeout( () => { isThrottled = false }, wait )
	fn( ...args )
}

/**
 * Test if an element has any portion within viewport.
 */
const isInViewport = ( element ) => {
	const top    = element.getBoundingClientRect().top
	const bottom = element.getBoundingClientRect().bottom
	const right  = element.getBoundingClientRect().right
	const left   = element.getBoundingClientRect().left
	const vw     = Math.max( document.documentElement.clientWidth || 0, window.innerWidth || 0 )
	const vh     = Math.max( document.documentElement.clientHeight || 0, window.innerHeight || 0 )

	const yInRange = ( top > 0 && top < vh || bottom > 0 && bottom < vh || top < 0 && bottom > vh )
	const xInRange = ( right > 0 && right < vw || left > 0 && left < vw || left < 0 && right > vw )
	const inView   = yInRange && xInRange

	return inView
}


/**
 * Get a timeline with new rotation of children.
 */
const getRotationTimeline = async ( event, children ) => {
	const container = getContainer( event.target )
	const maxAngleX = container.getAttribute( 'data-tilt-max-x' )
	const maxAngleY	= container.getAttribute( 'data-tilt-max-y' )
	const x         = event.clientX - container.getBoundingClientRect().left
	const y         = event.clientY - container.getBoundingClientRect().top
	const tl        = gsap.timeline()
	children.forEach( ( child ) => {
		// Only add child to timeline if it's in view.
		if ( isInViewport( child ) ) {
			const fractionX = ( x - child._tilt.originX ) / container.offsetWidth
			const fractionY = ( y - child._tilt.originY ) / container.offsetHeight
			const rotX      = ( fractionY * -maxAngleY ).toFixed( 2 ) // Apply Y-angle to CSS X-axis.
			const rotY      = ( fractionX * maxAngleX ).toFixed( 2 ) // Apply X-angle to CSS Y-axis.
			tl.to( child, { rotateX: rotX, rotateY: rotY, duration: 0.2 }, 0 )
		}
	} )
	return tl
}


/**
 * Callback for container 'mousemove' events.
 */
const updateOnMouseOver = async ( event, children ) => {
	const timeline = await getRotationTimeline( event, children )
	timeline.play()
}

const setupChildren = async () => {
	const containers = []
	document.querySelectorAll( config.childSelector ).forEach( ( child ) => {

		// Bail if the child has no ancestor container as we don't want to animate it.
		const container = getContainer( child )
		if ( ! container ) return
		
		// Add child to container prop.
		if ( ! container._tiltChildren ) {
			container._tiltChildren = []
		}
		container._tiltChildren.push( child )

		// Add container to array.
		containers.push( container )

		// Store origin values in child prop.
		child._tilt = {
			// Calc origins in relation to doc.
			container: container,
			originX: 0,
			originY: 0,
			setOrigin: function( el ) {
				const containerOffsetX = this.container.getBoundingClientRect().left + window.scrollX
				const containerOffsetY = this.container.getBoundingClientRect().top + window.scrollY
				const childOffsetX     = el.getBoundingClientRect().left + window.scrollX
				const childOffsetY     = el.getBoundingClientRect().top + window.scrollY
				this.originX = ( childOffsetX - containerOffsetX ) + ( el.offsetWidth / 2 )
				this.originY = ( childOffsetY - containerOffsetY ) + ( el.offsetHeight / 2 )
			}
		}
		child._tilt.setOrigin( child )
	} )
	const uniqueContainers = [ ...new Set( containers ) ]
	return uniqueContainers
}

const setupContainers = ( containers ) => {
	containers.forEach( ( container ) => { // Handle multiple in-page containers.
		const onMouseMoveHandler  = ( event ) => throttle( updateOnMouseOver, 22, [ event, container._tiltChildren ] ) // 30 calls a sec @22 in tests.
		const onMouseLeaveHandler = () => gsap.to( container._tiltChildren, { rotateX: 0, rotateY: 0, duration: 0.5, delay: 0.2 } )
		container.addEventListener( 'mousemove', onMouseMoveHandler )
		container.addEventListener( 'mouseleave', onMouseLeaveHandler )

		// Set config to parent to allow for external configuration of these values.
		container.setAttribute( 'data-tilt-max-x', config.maxAngleX )
		container.setAttribute( 'data-tilt-max-y', config.maxAngleY )
		container.style.perspective = config.perspective
	} )
}

const setOrigins = () => document.querySelectorAll( config.childSelector ).forEach( ( child ) => child._tilt.setOrigin( child ) )


/**
 * Initialise on window load.
 */
window.onload = async () => {
	// Bail if there's nothing to animate.
	if ( ! document.querySelector( config.childSelector ) ) return
	const containers = await setupChildren()
	setupContainers( containers )
	window.onresize = () => debounce( setOrigins, 50 )
}
