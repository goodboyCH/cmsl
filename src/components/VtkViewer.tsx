// src/components/VtkViewer.tsx
import React, { useRef, useEffect, memo } from 'react';
import { vtkGenericRenderWindow } from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';import { vtkHttpDataSetReader } from '@kitware/vtk.js/IO/Core';
import { vtkVolume } from '@kitware/vtk.js/Rendering/Core/Volume';
import { vtkVolumeMapper } from '@kitware/vtk.js/Rendering/Core/VolumeMapper';
import { vtkColorTransferFunction } from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction';
import { vtkPiecewiseFunction } from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction';

interface Props {
  vtiUrl: string | null;
}

// vtiUrl이 변경될 때만 리-렌더링 하도록 memo 사용
export const VtkViewer = memo(({ vtiUrl }: Props) => {
  const vtkContainerRef = useRef<HTMLDivElement>(null);
  // vtk 객체들을 저장할 ref (컴포넌트 리-렌더링 시에도 유지됨)
  const vtkContext = useRef<any>({});

  // 1. 뷰어 초기 설정 (컴포넌트 마운트 시 1회 실행)
  useEffect(() => {
    if (vtkContainerRef.current && !vtkContext.current.renderer) {
      const genericRenderWindow = vtkGenericRenderWindow.newInstance({
        background: [0.1, 0.1, 0.15], // 어두운 배경색
      });
      genericRenderWindow.setContainer(vtkContainerRef.current);

      const renderer = genericRenderWindow.getRenderer();
      const renderWindow = genericRenderWindow.getRenderWindow();

      // vtk 객체들을 context에 저장
      vtkContext.current = { genericRenderWindow, renderer, renderWindow };
    }

    // 컴포넌트 언마운트 시 vtk 객체 정리
    return () => {
      if (vtkContext.current.genericRenderWindow) {
        vtkContext.current.genericRenderWindow.delete();
        vtkContext.current = {};
      }
    };
  }, []); // [] 의존성 배열로 마운트 시 1회만 실행

  // 2. vtiUrl이 변경될 때마다 3D 볼륨 업데이트
  useEffect(() => {
    if (!vtiUrl || !vtkContext.current.renderer) {
      return;
    }

    const { renderer, renderWindow } = vtkContext.current;

    // --- 데이터 로더 설정 ---
    const reader = vtkHttpDataSetReader.newInstance({ fetchGzip: false });

    // --- 3D 볼륨 렌더링 설정 ---
    const actor = vtkVolume.newInstance();
    const mapper = vtkVolumeMapper.newInstance();
    mapper.setBlendModeToComposite(); // 볼륨 렌더링 모드
    
    // --- 컬러맵(Color Transfer Function) 설정 ---
    // (예: "jet"과 유사한 컬러맵)
    const ctf = vtkColorTransferFunction.newInstance();
    ctf.addRGBPoint(0.0, 0, 0, 1); // min (blue)
    ctf.addRGBPoint(0.5, 0, 1, 0); // mid (green)
    ctf.addRGBPoint(1.0, 1, 0, 0); // max (red)

    // --- 불투명도(Opacity Transfer Function) 설정 ---
    // (예: 값이 낮으면 투명, 높으면 불투명)
    const otf = vtkPiecewiseFunction.newInstance();
    otf.addPoint(0.0, 0.0);
    otf.addPoint(0.5, 0.3);
    otf.addPoint(1.0, 0.8);

    // --- 객체 연결 ---
    actor.setMapper(mapper);
    mapper.setInputConnection(reader.getOutputPort());
    
    // 컬러맵/불투명도 적용
    actor.getProperty().setRGBTransferFunction(0, ctf);
    actor.getProperty().setScalarOpacity(0, otf);
    actor.getProperty().setInterpolationTypeToLinear();

    // --- 데이터 로드 및 렌더링 ---
    reader.setUrl(vtiUrl).then(() => {
      reader.loadData().then(() => {
        // 이전에 렌더링된 볼륨이 있다면 제거
        if (vtkContext.current.actor) {
          renderer.removeVolume(vtkContext.current.actor);
        }

        // 새 볼륨 추가 및 카메라 리셋
        renderer.addVolume(actor);
        renderer.resetCamera();
        renderer.resetCameraClippingRange();
        renderWindow.render();

        // 현재 actor를 context에 저장
        vtkContext.current.actor = actor;
      });
    });

  }, [vtiUrl]); // vtiUrl이 바뀔 때마다 실행

  return (
    <div 
      ref={vtkContainerRef} 
      className="aspect-square bg-muted rounded-md border w-full h-full"
    />
  );
});