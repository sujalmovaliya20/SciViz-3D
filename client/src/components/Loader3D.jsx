import { Html, useProgress } from '@react-three/drei';

const Loader3D = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
        <div>LOADING ASSETS... {progress.toFixed(0)}%</div>
        <div style={{ width: '200px', height: '2px', background: 'var(--surface)', marginTop: '1rem', position: 'relative' }}>
          <div style={{ position: 'absolute', height: '100%', background: 'var(--accent)', width: `${progress}%`, transition: 'width 0.3s' }}></div>
        </div>
      </div>
    </Html>
  );
};

export default Loader3D;
