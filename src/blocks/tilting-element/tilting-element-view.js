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
	parentSelector:    '.tilt_container',
	altParentSelector: 'body',
	childSelector:     '.tilt',
	maxAngleX:         50,
	maxAngleY:         50,
	perspective:       200
}

let timeout
const debounce = ( fn, wait, args = [] ) => {
	clearTimeout( timeout )
	timeout = setTimeout( () => fn( ...args ), wait )
}

let isThrottled = false
const throttle = ( fn, wait, args = [] ) => {
	if ( isThrottled ) return
	isThrottled = true
	setTimeout( () => { isThrottled = false }, wait )
	fn( ...args )
}

const setRotations = async ( event, children ) => {
	const parent = event.target.closest( config.parentSelector )
	const x      = event.clientX - parent.getBoundingClientRect().left
	const y      = event.clientY - parent.getBoundingClientRect().top
	const tl     = gsap.timeline()
	children.forEach( ( child ) => {
		const fractionX = ( x - child._tilt.originX ) / parent.offsetWidth
		const fractionY = ( y - child._tilt.originY ) / parent.offsetHeight
		const rotX      = ( fractionY * -config.maxAngleY ).toFixed( 2 ) // Apply Y-angle to CSS X-axis.
		const rotY      = ( fractionX * config.maxAngleX ).toFixed( 2 ) // Apply X-angle to CSS Y-axis.
		tl.to( child, { rotateX: rotX, rotateY: rotY, duration: 0.2 }, 0 )
	} )
	return tl
}

const update = async ( event, elements ) => {
	const timeline = await setRotations( event, elements )
	timeline.play()
}

const setupChildren = async () => {
	const parents = []
	document.querySelectorAll( config.childSelector ).forEach( ( child ) => {
		
		// Set ancestor tilt container or body as parent.
		const parent = child.closest( config.parentSelector ) || child.closest( config.altParentSelector )

		// Add parent to array.
		if ( parent._tiltChildren ) {
			parent._tiltChildren.push( child )
		} else {
			parent._tiltChildren = []
			parent._tiltChildren.push( child )
		}

		// Add child to prop of parent.
		parents.push( child.closest( config.parentSelector ) || child.closest( config.altParentSelector ) )

		child._tilt = {
			// Calc origin in relation to doc.
			parent: child.closest( config.parentSelector ),
			originX: 0,
			originY: 0,
			setOrigin: function( el ) {
				const parentOffsetX = this.parent.getBoundingClientRect().left + window.scrollX
				const parentOffsetY = this.parent.getBoundingClientRect().top + window.scrollY
				const childOffsetX  = el.getBoundingClientRect().left + window.scrollX
				const childOffsetY  = el.getBoundingClientRect().top + window.scrollY
				this.originX = ( childOffsetX - parentOffsetX ) + ( el.offsetWidth / 2 )
				this.originY = ( childOffsetY - parentOffsetY ) + ( el.offsetHeight / 2 )
			}
		}
		child._tilt.setOrigin( child )
	} )
	const uniqueParents = [ ...new Set( parents ) ]
	return uniqueParents
}

const setupParents = ( parents ) => {
	parents.forEach( ( parent ) => { // Handle multiple in-page containers.
		const onMouseMoveHandler  = ( event ) => throttle( update, 22, [ event, parent._tiltChildren ] ) // 30 calls a sec @22 in tests.
		const onMouseLeaveHandler = () => gsap.to( parent._tiltChildren, { rotateX: 0, rotateY: 0, duration: 0.5, delay: 0.2 } )
		parent.addEventListener( 'mousemove', onMouseMoveHandler )
		parent.addEventListener( 'mouseleave', onMouseLeaveHandler )
	} )
}	

const setupDemoControls = () => {
	const sliders = document.querySelectorAll( '.controls_slider' )
	sliders.forEach( ( slider ) => {
		const setting = slider.getAttribute( 'id' )
		const output  = slider.previousElementSibling
		slider.value = config[ setting ]
		output.innerText = config[ setting ]
		slider.addEventListener( 'input', function( event ) {
			config[ setting ] = this.value
			output.innerText = this.value
			if ( setting === 'perspective' ) {
				document.querySelector( ':root' ).style.setProperty( '--perspective', config[ setting ] + 'px' )
			}
		} )
	} )
	document.querySelector( '#reset' ).addEventListener( 'click', function() {
		sliders.forEach( ( slider ) => {
			let defaultValue = slider.getAttribute( 'value' )
			slider.value = defaultValue
			const event      = new Event( 'change' )
			slider.dispatchEvent( event )
		} )
	} )
}

const setOrigins = () => document.querySelectorAll( config.childSelector ).forEach( ( child ) => child._tilt.setOrigin( child ) )

window.onload = async () => {

console.log( 'TILT CALLED' )


	// Bail if there's nothing to animate.
	if ( ! document.querySelector( config.childSelector ) ) return
	const parents = await setupChildren()
	setupParents( parents )
	setupDemoControls()
	window.onresize = () => debounce( setOrigins, 50 )
}
