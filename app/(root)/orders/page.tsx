import { AdminBrowser } from "./_components/admin/admin-browser";
import { StaffBrowser } from "./_components/staff/staff-browser";

const OrdersPage = () => {
    const isAdmin = true;

    return (
        <>
            {isAdmin ? (
                <AdminBrowser />
            ) : (
                <StaffBrowser />
            )

            }

        </>
    )
}

export default OrdersPage;