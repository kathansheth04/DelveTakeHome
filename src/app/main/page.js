import TopBar from '../components/TopBar';
import UserStatusTable from '../components/UserStatusTable';

export default function main() {
    return (
        <div className="p-6 space-y-6">
          <div className="space-y-6">
            <TopBar />
            <UserStatusTable />
          </div>
        </div>
      );
}