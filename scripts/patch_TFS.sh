#!/bin/bash
declare -a errorArray=(
    "console.error(\"Ended a touch event which was not counted in"
    "console.error(\"Cannot record touch end without a touch start" 
    "console.error(\"Cannot record touch move without a touch start"
    "console.error(\"Attempted to transition from state"
)

declare -a replaceArray=(
    "console.log(\"Ended a touch event which was not counted in" 
    "console.log(\"Cannot record touch end without a touch start" 
    "console.log(\"Cannot record touch move without a touch start"
    "console.log(\"Attempted to transition from state"
)

arraylength=${#errorArray[@]}
for (( i=1; i<${arraylength}+1; i++ ));
do
  sed -i '' "s/${errorArray[$i-1]}/${replaceArray[$i-1]}/g" ./android/app/src/main/assets/index.android.bundle
done