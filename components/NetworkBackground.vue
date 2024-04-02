<template>
  <div class="relative h-screen w-screen color" >
    <canvas ref="canvas" class="w-full h-full"></canvas>
    <div class="absolute inset-0 flex flex-col items-center justify-center text-black">
      <div class="text-center">
        <h1 class="text-6xl font-bold">
          Welcome to CulinaPlan
        </h1>
        <p class="mt-4 text-xl max-w-lg mx-auto">
          CulinaPlan is an innovative web application that aims to revolutionize the everyday cooking experience...
        </p>
        <StartExploringButton/>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default defineComponent({
  setup() {
    const canvas: Ref<HTMLCanvasElement | null> = ref(null);
    const nodes: Node[] = [];
    let nodeCount: number;
    let maxDistance: number;

    const resizeCanvas = () => {
      if (canvas.value) {
        canvas.value.width = window.innerWidth;
        canvas.value.height = window.innerHeight;

        nodeCount = window.innerWidth < 768 ? 100 : 150;
        maxDistance = window.innerWidth < 768 ? 50 : 100;

        initializeNodes();
      }
    };

    const initializeNodes = () => {
      nodes.splice(0, nodes.length);
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
      }
    };

    
    
    const drawNodes = () => {
      if (canvas.value) {
        const ctx = canvas.value.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

          // Linien
          ctx.strokeStyle = 'rgb(243, 239, 255, 0.9)';

          nodes.forEach(node => {
            nodes.forEach(otherNode => {
              const distance = Math.sqrt(Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2));
              if (distance < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(otherNode.x, otherNode.y);
                ctx.stroke();
              }
            });
          });

          // Kreise
          ctx.fillStyle = 'rgb(59, 130, 246, 1)'; 

          nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
      }
    };

    const updateNodePositions = () => {
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x <= 0 || node.x >= window.innerWidth) node.vx *= -1;
        if (node.y <= 0 || node.y >= window.innerHeight) node.vy *= -1;
      });
    };

    const animate = () => {
      updateNodePositions();
      drawNodes();
      requestAnimationFrame(animate);
    };

    onMounted(() => {
      resizeCanvas();
      animate();
      window.addEventListener('resize', resizeCanvas);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', resizeCanvas);
    });

    return { canvas };
  },
});
</script>

<style scoped>
  .color {
    background-color: white;
  }
</style>
