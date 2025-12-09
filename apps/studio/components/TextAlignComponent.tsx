import React from 'react'
import {BlockDecoratorProps} from 'sanity'

type TextAlignValue = 'left' | 'center' | 'right'
interface TextAlignBlockDecoratorProps extends BlockDecoratorProps {
  value: TextAlignValue
}

export const TextAlign = (props: TextAlignBlockDecoratorProps) => {
  return (
    <div
      style={{
        // props.value exists and is of type TextAlignValue
        textAlign: props.value ? props.value : 'left',
        width: '100%',
      }}
    >
      {props.children}
    </div>
  )
}
