import { trigger, state, style, transition, animate, query, group } from '@angular/animations';

export const fadeInUp = trigger(
  'fadeInUp', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translate3d(0, 100%, 0)' }),
      animate('300ms', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }))
    ])
  ]
)

export const fadeIn = trigger(
  'fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms', style({ opacity: 1 }))
    ])
  ]
)

export const fadeInRight = trigger(
  'fadeInRight', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translate3d(100%, 0, 0)' }),
      animate('300ms', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }))
    ])
  ]
)

export const fadeInSlow = trigger(
  'fadeInSlow', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('600ms', style({ opacity: 1 }))
    ])
  ]
)

export const fadeInOut = trigger(
  'fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      style({ opacity: 1 }),
      animate('300ms', style({ opacity: 0 }))
    ])
  ]
)

export const fadeInDownOutUp = trigger(
  'fadeInDownOutUp', [
    transition(':enter', [
      style({ opacity: 0, transform: "translate3d(0, -100%, 0)" }),
      animate('300ms', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }))
    ]),
    transition(':leave', [
      style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }),
      animate('300ms', style({ opacity: 0, transform: 'translate3d(0, -100%, 0)' }))
    ])
  ]
)

export const fadeInDownOutUp500ms = trigger(
  'fadeInDownOutUp500ms', [
    transition(':enter', [
      style({ opacity: 0, transform: "translate3d(0, -100%, 0)" }),
      animate('500ms', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }))
    ]),
    transition(':leave', [
      style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }),
      animate('500ms', style({ opacity: 0, transform: 'translate3d(0, -100%, 0)' }))
    ])
  ]
)

export const fadeInUpOutDown500ms = trigger(
  'fadeInUpOutDown500ms', [
    transition(':enter', [
      style({ opacity: 0, transform: "translate3d(0, 100%, 0)" }),
      animate('500ms', style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }))
    ]),
    transition(':leave', [
      style({ opacity: 1, transform: 'translate3d(0, 0, 0)' }),
      animate('500ms', style({ opacity: 0, transform: 'translate3d(0, 100%, 0)' }))
    ])
  ]
)


export const fadeOut = trigger(
  'fadeOut', [
    transition(':leave', [
      style({ opacity: 1 }),
      animate('300ms', style({ opacity: 0 }))
    ])
  ]
)

export const fadeInOut1000ms = trigger(
  'fadeInOut1000ms', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('1000ms 500ms', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      style({ opacity: 1 }),
      animate('1000ms 500ms', style({ opacity: 0 }))
    ])
  ]
)