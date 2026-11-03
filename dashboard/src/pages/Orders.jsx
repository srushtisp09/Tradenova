import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';

export default function Orders() {
  return (
    <Card className="mx-auto max-w-lg py-12 text-center">
      <h2 className="text-xl font-semibold">No orders yet</h2>
      <p className="mt-2 text-mute">Place a buy or sell order from your watchlist. Saved order history arrives in Step 9.</p>
      <Link to="/watchlist"><Button className="mt-6">Go to watchlist</Button></Link>
    </Card>
  );
}
