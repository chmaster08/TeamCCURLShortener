import Url from "@/libs/model/url";
import { ContentCopy, Delete, Edit, QrCode } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Link,
} from "@mui/material";

interface URLCardProps {
  urlItem: Url;
  onEdit: (url: Url) => void;
  onDelete: (url: Url) => void;
  onCopy: (url: Url) => void;
  onQrCode: (url: Url) => void;
}

export default function URLCard(props: URLCardProps) {
  return (
    <Card sx={{ minWidth: 400, maxWidth: 600 }}>
      <CardHeader
        title={props.urlItem.name}
        avatar={
          <Avatar
            alt={props.urlItem.name}
            src={`http://www.google.com/s2/favicons?domain=${props.urlItem.original}`}
          />
        }
        action={
          <Box>
            <IconButton
              aria-label="copy"
              onClick={() => props.onCopy(props.urlItem)}
            >
              <ContentCopy />
            </IconButton>
            <IconButton
              aria-label="edit"
              onClick={() => props.onEdit(props.urlItem)}
            >
              <Edit />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => props.onDelete(props.urlItem)}
            >
              <Delete />
            </IconButton>
            <IconButton
              aria-label="qr code"
              onClick={() => props.onQrCode(props.urlItem)}
            >
              <QrCode />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <Box>
          <Link
            href={props.urlItem.original}
            variant="h6"
            gutterBottom
            underline="hover"
          >
            {props.urlItem.shortCode}
          </Link>
          <Box>
            <Link
              href={props.urlItem.original}
              variant="body1"
              gutterBottom
              underline="hover"
              color="inherit"
            >
              {props.urlItem.original}
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
