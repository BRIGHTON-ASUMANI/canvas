/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
// Canvas.js
import React from 'react';
import {
  Stage, Layer, Text, Circle, Rect, RegularPolygon,
} from 'react-konva';

function Canvas({
  shapes, selectedShapeIndex, handleMouseDown, handleTextDblClick,
}) {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer onMouseDown={handleMouseDown}>
        {shapes.map((shape, index) => {
          if (shape && shape.attrs) {
            const isSelected = selectedShapeIndex === index;
            return (
              <React.Fragment key={index}>
                {shape.type === 'circle' && (
                <>
                  <Circle
                    {...shape.attrs}
                    draggable
                    onDblClick={() => handleTextDblClick(index)}
                    className={isSelected ? 'selected' : ''}
                  />
                  <Text
                    text={shape.attrs.text}
                    x={shape.attrs.x - 20}
                    y={shape.attrs.y - 10}
                    fill={shape.attrs.fillText}
                    fontSize={shape.attrs.fontSize}
                    visible={!!shape.attrs.text}
                    width={60}
                    align="center"
                    wrap="word"
                  />
                </>
                )}
                {shape.type === 'rect' && (
                <>
                  <Rect
                    {...shape.attrs}
                    draggable
                    onDblClick={() => handleTextDblClick(index)}
                    className={isSelected ? 'selected' : ''}
                  />
                  <Text
                    text={shape.attrs.text}
                    x={shape.attrs.x + 5}
                    y={shape.attrs.y + 20}
                    fill={shape.attrs.fillText}
                    fontSize={shape.attrs.fontSize}
                    visible={!!shape.attrs.text}
                    width={60}
                    align="center"
                    wrap="word"
                  />
                </>
                )}
                {shape.type === 'diamond' && (
                <>
                  <RegularPolygon
                    {...shape.attrs}
                    sides={4}
                    draggable
                    onDblClick={() => handleTextDblClick(index)}
                    className={isSelected ? 'selected' : ''}
                  />
                  <Text
                    text={shape.attrs.text}
                    x={shape.attrs.x - 25}
                    y={shape.attrs.y - 10}
                    fill={shape.attrs.fillText}
                    fontSize={shape.attrs.fontSize}
                    visible={!!shape.attrs.text}
                    width={60}
                    align="center"
                    wrap="word"
                  />
                </>
                )}
                {shape.type === 'text' && (
                <Text
                  key={index}
                  {...shape.attrs}
                  onDblClick={() => handleTextDblClick(index)}
                  className={isSelected ? 'selected' : ''}
                />
                )}
              </React.Fragment>
            );
          }
          return null;
        })}
      </Layer>
    </Stage>
  );
}

export default Canvas;
